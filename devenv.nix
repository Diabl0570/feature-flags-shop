{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = with pkgs; [
     pkgs.git
     fzf
    ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  # https://devenv.sh/basics/
  enterShell = ''
    hello         # Run scripts directly
    git --version # Use packages
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
  languages = {
    javascript = {
      enable = true;
      npm.enable = true;
    };
    typescript.enable = true;
  };

  
  scripts.worktree-add.exec = ''
    log() {
      echo "$@" >&2
    }

    if [[ -z "''$1" ]]; then
      log "Usage: worktree-add <worktreename>"
      exit 1
    fi
    BRANCH="''$1"
    if ! git check-ref-format --branch "$BRANCH" >/dev/null 2>&1; then
      log "Invalid branch name: $BRANCH"
      exit 1
    fi
    # Sanitize for directory: slashes -> hyphens; trim leading/trailing hyphens (worktree dir is one segment under .worktree/)
    DIR_NAME=$(echo -n "$BRANCH" | tr '/' '-' | sed -e 's/^-*//' -e 's/-*$//')
    [[ -z "$DIR_NAME" ]] && { log "Invalid branch name (empty after sanitization)"; exit 1; }
    GIT_COMMON_DIR=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null) || {
      log "Not inside a git repository."
      exit 1
    }
    GIT_ROOT=$(dirname "$GIT_COMMON_DIR")
    WORKTREE_PATH="''$GIT_ROOT.worktree/''$DIR_NAME"
    # Only print DIR_NAME to stdout when not emitting cd (otherwise wta's eval would run it as a command)
    [[ "''${WORKTREE_ADD_EMIT_CD:-0}" != "1" ]] && echo "$DIR_NAME"
    # If two branches sanitize to the same dir (e.g. feat/a and feat-a), the second fails here
    if [[ -d "$WORKTREE_PATH" ]]; then
      log "Worktree path already exists: $WORKTREE_PATH"
      exit 1
    fi
    # Create a new branch named after the worktree, from current HEAD, so the same branch is not in two worktrees
    # PRE_COMMIT_ALLOW_NO_CONFIG=1: new worktree has no .pre-commit-config.yaml yet; post-checkout would fail otherwise
    # Redirect git stdout to stderr so wta's eval only sees the cd/echo lines we emit below
    PRE_COMMIT_ALLOW_NO_CONFIG=1 git worktree add "$WORKTREE_PATH" -b "$BRANCH" 1>&2 || exit 1
    ORIGINAL="$GIT_ROOT"
    copy_item() {
      local src="$ORIGINAL/$1" dst="$WORKTREE_PATH/$1"
      if [[ -e "$src" ]]; then
        mkdir -p "$(dirname "$dst")"
        if [[ -d "$src" ]]; then
          cp -r "$src" "$dst"
        else
          cp "$src" "$dst"
        fi
        log "Copied $1"
      fi
    }
    # Add or remove paths to copy into new worktrees (files and dirs both supported)
    WORKTREE_COPY_ITEMS=(
      .env.example
      .env.local
      .env.test.local
      .envrc
      .env.local
      .vercel
      devenv.local.nix
    )
    for item in "''${WORKTREE_COPY_ITEMS[@]}"; do
      copy_item "$item"
    done
    (cd "$WORKTREE_PATH" && direnv allow)

    if [[ "''${WORKTREE_ADD_EMIT_CD:-0}" == "1" ]]; then
      printf 'cd %q\n' "$WORKTREE_PATH"
      printf 'echo %q\n' "Changed directory to: $WORKTREE_PATH"
    else
      log "Worktree ready at: $WORKTREE_PATH"
      log "Run: cd $WORKTREE_PATH"
      log "Changed directory note: not auto-cd (call through wta to auto-cd)."
    fi
  '';

  scripts.wta.exec = ''eval "$(WORKTREE_ADD_EMIT_CD=1 worktree-add "$@")"'';

  scripts.wto.exec = ''
    log() {
      echo "$@" >&2
    }

    usage() {
      log "Usage: wto [name] [--opener <binary>]"
      log ""
      log "Open an existing managed worktree from <repo-root>.worktree."
      log ""
      log "Examples:"
      log "  wto"
      log "  wto open-worktree-command"
      log "  wto --opener code"
      log "  wto open-worktree-command --opener code"
    }

    OPENER="cursor"
    TARGET_NAME=""

    while [[ $# -gt 0 ]]; do
      case "$1" in
        --help|-h)
          usage
          exit 0
          ;;
        --opener)
          shift
          if [[ -z "''${1:-}" ]]; then
            log "Missing value for --opener"
            usage
            exit 1
          fi
          OPENER="$1"
          ;;
        -*)
          log "Unknown option: $1"
          usage
          exit 1
          ;;
        *)
          if [[ -n "$TARGET_NAME" ]]; then
            log "Only one worktree name can be provided."
            usage
            exit 1
          fi
          TARGET_NAME="$1"
          ;;
      esac
      shift
    done

    if ! command -v "$OPENER" >/dev/null 2>&1; then
      log "Opener binary not found: $OPENER"
      log "Install '$OPENER' or pass another binary with --opener."
      exit 1
    fi

    GIT_COMMON_DIR=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null) || {
      log "Not inside a git repository."
      exit 1
    }
    REPO_ROOT=$(dirname "$GIT_COMMON_DIR")
    WORKTREE_ROOT="''${REPO_ROOT}.worktree"

    if [[ ! -d "$WORKTREE_ROOT" ]]; then
      log "Managed worktree directory does not exist: $WORKTREE_ROOT"
      exit 1
    fi

    mapfile -t CANDIDATES < <(find "$WORKTREE_ROOT" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort)
    if [[ ''${#CANDIDATES[@]} -eq 0 ]]; then
      log "No managed worktrees found under: $WORKTREE_ROOT"
      exit 1
    fi

    sanitize_name() {
      echo -n "$1" | tr '/' '-' | sed -e 's/^-*//' -e 's/-*$//'
    }

    SELECTED_DIR=""
    if [[ -n "$TARGET_NAME" ]]; then
      SELECTED_DIR=$(sanitize_name "$TARGET_NAME")
      if [[ -z "$SELECTED_DIR" ]]; then
        log "Invalid worktree name (empty after sanitization): $TARGET_NAME"
        exit 1
      fi
      if [[ ! -d "$WORKTREE_ROOT/$SELECTED_DIR" ]]; then
        log "Managed worktree not found: $WORKTREE_ROOT/$SELECTED_DIR"
        exit 1
      fi
    else
      if ! command -v fzf >/dev/null 2>&1; then
        log "fzf is required for interactive selection but is not available."
        exit 1
      fi
      SELECTED_DIR=$(printf '%s\n' "''${CANDIDATES[@]}" | fzf --prompt="wto > " --height=40% --layout=reverse --border) || {
        log "No worktree selected."
        exit 1
      }
    fi

    WORKTREE_PATH="$WORKTREE_ROOT/$SELECTED_DIR"
    "$OPENER" "$WORKTREE_PATH"
  '';

  scripts.wtd.exec = ''
    log() {
      echo "$@" >&2
    }

    usage() {
      log "Usage: wtd [name...] [--force]"
      log ""
      log "Delete one or more managed worktrees from <repo-root>.worktree."
      log "Refuses to delete the current worktree. Use --force for unclean or locked worktrees."
      log ""
      log "Examples:"
      log "  wtd"
      log "  wtd my-branch"
      log "  wtd branch-a branch-b"
      log "  wtd --force my-branch"
    }

    FORCE=""
    NAMES=()

    while [[ $# -gt 0 ]]; do
      case "$1" in
        --help|-h)
          usage
          exit 0
          ;;
        --force|-f)
          FORCE="--force"
          ;;
        -*)
          log "Unknown option: $1"
          usage
          exit 1
          ;;
        *)
          NAMES+=("$1")
          ;;
      esac
      shift
    done

    GIT_COMMON_DIR=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null) || {
      log "Not inside a git repository."
      exit 1
    }
    REPO_ROOT=$(dirname "$GIT_COMMON_DIR")
    WORKTREE_ROOT="''${REPO_ROOT}.worktree"

    if [[ ! -d "$WORKTREE_ROOT" ]]; then
      log "Managed worktree directory does not exist: $WORKTREE_ROOT"
      exit 1
    fi

    mapfile -t CANDIDATES < <(find "$WORKTREE_ROOT" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort)
    if [[ ''${#CANDIDATES[@]} -eq 0 ]]; then
      log "No managed worktrees found under: $WORKTREE_ROOT"
      exit 1
    fi

    sanitize_name() {
      echo -n "$1" | tr '/' '-' | sed -e 's/^-*//' -e 's/-*$//'
    }

    TO_DELETE=()
    if [[ ''${#NAMES[@]} -gt 0 ]]; then
      for name in "''${NAMES[@]}"; do
        dir=$(sanitize_name "$name")
        if [[ -z "$dir" ]]; then
          log "Invalid worktree name (empty after sanitization): $name"
          exit 1
        fi
        if [[ ! -d "$WORKTREE_ROOT/$dir" ]]; then
          log "Managed worktree not found: $WORKTREE_ROOT/$dir"
          exit 1
        fi
        TO_DELETE+=("$WORKTREE_ROOT/$dir")
      done
    else
      if ! command -v fzf >/dev/null 2>&1; then
        log "fzf is required for interactive selection but is not available."
        exit 1
      fi
      SELECTED=$(printf '%s\n' "''${CANDIDATES[@]}" | fzf --multi --prompt="wtd > " --height=40% --layout=reverse --border) || {
        log "No worktree selected."
        exit 1
      }
      while IFS= read -r dir; do
        [[ -z "$dir" ]] && continue
        TO_DELETE+=("$WORKTREE_ROOT/$dir")
      done <<< "$SELECTED"
    fi

    CURRENT=$(git rev-parse --path-format=absolute --show-toplevel 2>/dev/null) || true
    for path in "''${TO_DELETE[@]}"; do
      if [[ -n "$CURRENT" && "$path" == "$CURRENT" ]]; then
        log "Cannot delete the current worktree: $path"
        exit 1
      fi
      case "$path" in
        "$WORKTREE_ROOT"/*) ;;
        *)
          log "Refusing to delete path outside managed worktrees: $path"
          exit 1
          ;;
      esac
    done

    FAILED=()
    for path in "''${TO_DELETE[@]}"; do
      if git worktree remove $FORCE "$path" 2>/dev/null; then
        log "Removed: $path"
      else
        FAILED+=("$path")
      fi
    done

    if [[ ''${#FAILED[@]} -gt 0 ]]; then
      log "Failed to remove:"
      for path in "''${FAILED[@]}"; do log "  $path"; done
      exit 1
    fi
  '';
}
