/* ==========================================
   Calculadoras ClaveContable (IVA y Boleta de Honorarios)
   ========================================== */

"use strict";

// === Tasas: actualizar aquí cuando cambie la ley ===
// Retención de boletas de honorarios por año (Ley 21.133, alza gradual).
// Expresadas en puntos por 10.000 (1525 = 15,25 %) para calcular con enteros.
const RETENCION_HONORARIOS = {
  2025: 1450,
  2026: 1525,
  2027: 1600,
  2028: 1700,
};
const IVA = 1900; // 19 %
const BASE = 10000;

// === Utilidades ===
const formatoCLP = new Intl.NumberFormat("es-CL");

function pesos(n) {
  return "$" + formatoCLP.format(n);
}

function porcentaje(tasa) {
  return (tasa / 100).toLocaleString("es-CL", { maximumFractionDigits: 2 }) + " %";
}

// Lee solo los dígitos del input y lo reescribe con separador de miles
function leerMonto(input) {
  const digitos = input.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12);
  input.value = digitos ? formatoCLP.format(Number(digitos)) : "";
  return digitos ? Number(digitos) : 0;
}

function pintar(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = pesos(valor);
}

function tasaHonorarios(anio) {
  if (RETENCION_HONORARIOS[anio]) return RETENCION_HONORARIOS[anio];
  const anios = Object.keys(RETENCION_HONORARIOS).map(Number);
  return RETENCION_HONORARIOS[anio > Math.max(...anios) ? Math.max(...anios) : Math.min(...anios)];
}

// === Cálculos ===
// Desde el bruto: retención = bruto × tasa, líquido = bruto − retención
function honorariosDesdeBruto(bruto, tasa) {
  const retencion = Math.round((bruto * tasa) / BASE);
  return { bruto, retencion, liquido: bruto - retencion };
}

// Desde el líquido: bruto = líquido / (1 − tasa), retención = bruto − líquido
function honorariosDesdeLiquido(liquido, tasa) {
  const bruto = Math.round((liquido * BASE) / (BASE - tasa));
  return { bruto, retencion: bruto - liquido, liquido };
}

// Desde el neto: IVA = neto × 0,19, total = neto + IVA
function ivaDesdeNeto(neto) {
  const iva = Math.round((neto * IVA) / BASE);
  return { neto, iva, total: neto + iva };
}

// Desde el total: neto = total / 1,19 (no se resta el 19 % al total)
function ivaDesdeTotal(total) {
  const neto = Math.round((total * BASE) / (BASE + IVA));
  return { neto, iva: total - neto, total };
}

// === Calculadora de boleta de honorarios ===
function initHonorarios() {
  const input = document.getElementById("hon-monto");
  const selectAnio = document.getElementById("hon-anio");
  if (!input || !selectAnio) return;

  const actual = new Date().getFullYear();
  Object.keys(RETENCION_HONORARIOS).forEach((anio) => {
    const op = document.createElement("option");
    op.value = anio;
    op.textContent = `${anio} · ${porcentaje(RETENCION_HONORARIOS[anio])}`;
    selectAnio.appendChild(op);
  });
  selectAnio.value = RETENCION_HONORARIOS[actual] ? String(actual) : selectAnio.options[selectAnio.options.length - 1].value;

  function calcular() {
    const monto = leerMonto(input);
    const tasa = tasaHonorarios(Number(selectAnio.value));
    const liq = honorariosDesdeLiquido(monto, tasa);
    const bru = honorariosDesdeBruto(monto, tasa);

    document.querySelectorAll("[data-tasa-hon]").forEach((el) => {
      el.textContent = porcentaje(tasa);
    });

    pintar("liq-bruto", liq.bruto);
    pintar("liq-bruto-2", liq.bruto);
    pintar("liq-retencion", liq.retencion);
    pintar("liq-liquido", liq.liquido);
    pintar("liq-liquido-2", liq.liquido);

    pintar("bru-bruto", bru.bruto);
    pintar("bru-bruto-2", bru.bruto);
    pintar("bru-retencion", bru.retencion);
    pintar("bru-liquido", bru.liquido);
    pintar("bru-liquido-2", bru.liquido);
  }

  input.addEventListener("input", calcular);
  selectAnio.addEventListener("change", calcular);
  calcular();
}

// === Calculadora de IVA ===
function initIva() {
  const input = document.getElementById("iva-monto");
  const modos = document.querySelectorAll('input[name="iva-modo"]');
  if (!input || !modos.length) return;

  function calcular() {
    const monto = leerMonto(input);
    const modo = document.querySelector('input[name="iva-modo"]:checked').value;
    const r = modo === "neto" ? ivaDesdeNeto(monto) : ivaDesdeTotal(monto);

    pintar("iva-neto", r.neto);
    pintar("iva-iva", r.iva);
    pintar("iva-total", r.total);

    document.getElementById("iva-res-neto").classList.toggle("main", modo === "total");
    document.getElementById("iva-res-total").classList.toggle("main", modo === "neto");
  }

  input.addEventListener("input", calcular);
  modos.forEach((m) => m.addEventListener("change", calcular));
  calcular();
}

// === Botones "Copiar" ===
function initCopiar() {
  document.querySelectorAll(".copy[data-copy-from]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const origen = document.getElementById(btn.dataset.copyFrom);
      if (!origen) return;
      const valor = origen.textContent.replace(/\D/g, "");
      const listo = () => {
        btn.textContent = "Copiado";
        setTimeout(() => (btn.textContent = "Copiar"), 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(valor).then(listo, () => {});
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHonorarios();
  initIva();
  initCopiar();
});
