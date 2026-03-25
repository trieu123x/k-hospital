const BLUE = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

export const log = {
  info(msg) {
    console.log(`${DIM}[INFO]${RESET} ${msg}`);
  },

  success(msg) {
    console.log(`${GREEN}[OK]${RESET} ${msg}`);
  },

  warn(msg) {
    console.warn(`${YELLOW}[WARN]${RESET} ${msg}`);
  },

  error(msg) {
    console.error(`${RED}[ERROR]${RESET} ${msg}`);
  },

  phase(name) {
    console.log('');
    console.log(`${BOLD}${BLUE}━━━ ${name} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  },

  result(label, value) {
    console.log(`  ${DIM}→${RESET} ${label}: ${BOLD}${value}${RESET}`);
  },

  banner(title, lines = []) {
    const width = 52;
    console.log('');
    console.log(`${BLUE}╔${'═'.repeat(width)}╗${RESET}`);
    console.log(`${BLUE}║${RESET}${BOLD}${title.padStart((width + title.length) / 2).padEnd(width)}${RESET}${BLUE}║${RESET}`);
    if (lines.length > 0) {
      console.log(`${BLUE}╠${'═'.repeat(width)}╣${RESET}`);
      for (const line of lines) {
        console.log(`${BLUE}║${RESET}  ${line.padEnd(width - 2)}${BLUE}║${RESET}`);
      }
    }
    console.log(`${BLUE}╚${'═'.repeat(width)}╝${RESET}`);
    console.log('');
  },
};
