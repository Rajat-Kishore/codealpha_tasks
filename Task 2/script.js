const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const keys = document.querySelectorAll('.key');
const opKeys = document.querySelectorAll('.key-op');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

const MAX_DIGITS = 12;

function updateScreen(){
  display.textContent = formatForDisplay(current);
  historyEl.textContent = previous !== null && operator
    ? `${formatForDisplay(previous)} ${operator}`
    : '\u00A0';
}

function formatForDisplay(value){
  const num = Number(value);
  if (Number.isNaN(num)) return 'Error';
  if (Math.abs(num) >= 1e12) return num.toExponential(4);
  const str = value.toString();
  if (str.length > MAX_DIGITS + 1){
    return num.toPrecision(MAX_DIGITS).replace(/\.?0+$/, '');
  }
  return str;
}

function inputDigit(d){
  if (justEvaluated){
    current = d;
    justEvaluated = false;
  } else {
    current = current === '0' ? d : current + d;
  }
  if (current.replace('-', '').replace('.', '').length > MAX_DIGITS) return;
  updateScreen();
}

function inputDecimal(){
  if (justEvaluated){
    current = '0.';
    justEvaluated = false;
    updateScreen();
    return;
  }
  if (!current.includes('.')) current += '.';
  updateScreen();
}

function backspace(){
  if (justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateScreen();
}

function clearAll(){
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  opKeys.forEach(k => k.classList.remove('is-active'));
  updateScreen();
}

function percent(){
  current = String(Number(current) / 100);
  updateScreen();
}

function toggleSign(){
  if (current !== '0') current = current.startsWith('-') ? current.slice(1) : '-' + current;
  justEvaluated = false;
  updateScreen();
}

function square(){
  current = String(Number(current) ** 2);
  justEvaluated = false;
  updateScreen();
}

function sqrt(){
  const num = Number(current);
  current = num < 0 ? 'Error' : String(Math.sqrt(num));
  justEvaluated = false;
  updateScreen();
}

function reciprocal(){
  const num = Number(current);
  current = num === 0 ? 'Error' : String(1 / num);
  justEvaluated = false;
  updateScreen();
}

function compute(a, b, op){
  switch(op){
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function chooseOperator(op){
  opKeys.forEach(k => k.classList.toggle('is-active', k.dataset.op === op));

  if (operator && previous !== null && !justEvaluated){
    const result = compute(previous, Number(current), operator);
    previous = result;
    current = String(result);
  } else {
    previous = Number(current);
  }
  operator = op;
  justEvaluated = false;
  current = '0';
  updateScreen();
}

function equals(){
  if (operator === null || previous === null) return;
  const result = compute(previous, Number(current), operator);
  previous = null;
  current = String(result);
  operator = null;
  justEvaluated = true;
  opKeys.forEach(k => k.classList.remove('is-active'));
  updateScreen();
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    const { num, action, op } = key.dataset;
    if (num !== undefined) inputDigit(num);
    else if (op !== undefined) chooseOperator(op);
    else if (action === 'decimal') inputDecimal();
    else if (action === 'backspace') backspace();
    else if (action === 'clear') clearAll();
    else if (action === 'percent') percent();
    else if (action === 'equals') equals();
    else if (action === 'sign') toggleSign();
    else if (action === 'square') square();
    else if (action === 'sqrt') sqrt();
    else if (action === 'reciprocal') reciprocal();
  });
});

const keyMap = {
  '+': '+', '-': '−', '*': '×', '/': '÷'
};

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9'){
    inputDigit(e.key);
  } else if (e.key === '.'){
    inputDecimal();
  } else if (keyMap[e.key]){
    chooseOperator(keyMap[e.key]);
  } else if (e.key === 'Enter' || e.key === '='){
    e.preventDefault();
    equals();
  } else if (e.key === 'Backspace'){
    backspace();
  } else if (e.key === 'Escape'){
    clearAll();
  } else if (e.key === '%'){
    percent();
  }
});

updateScreen();

/* ---------- theme ---------- */

const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const root = document.documentElement;

function applyTheme(theme){
  if (theme === 'dark'){
    root.setAttribute('data-theme', 'dark');
    themeLabel.textContent = 'Light';
  } else {
    root.removeAttribute('data-theme');
    themeLabel.textContent = 'Dark';
  }
}

const savedTheme = localStorage.getItem('fn-calc-theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('fn-calc-theme', next);
});
