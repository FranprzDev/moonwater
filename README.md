# MoonWater 🌙💧

**El loop que empieza en la Tierra** — Simulador 3D interactivo de ciclo cerrado de agua para una base lunar.

Proyecto para el [NASA Space Apps Challenge 2026](https://www.spaceappschallenge.org/).

## ¿Qué es?

Un simulador paramétrico en tiempo real del loop hídrico completo de una base polar lunar:

- **Pozo de hielo** en una Región de Sombra Permanente (PSR)
- **Planta ISRU**: reactor térmico tipo LADI, electrólisis PEM, tanques criogénicos H₂/O₂
- **Hábitat modular** con invernadero y campo solar
- **Tuberías visibles** con flujo de agua animado
- Balance de masa y energía con datos reales de NASA (LCROSS, Mini-SAR, ECLSS de la ISS)

## Modo Competitivo ⚔️

Sobreviví 30 días lunares manteniendo el banco de agua positivo y el margen energético sin colapsar. El puntaje combina cierre del loop, agua acumulada y eficiencia energética.

## Stack

- React + Vite
- react-three-fiber / three.js (WebGL)
- Tailwind CSS
- Zustand (estado de simulación)

## Ejecutar

```bash
npm install
npm run dev
```

## Filosofía

La Luna es el caso límite donde la ingeniería del agua no puede esconder sus deudas:
sin ríos ni lluvia, cada gota debe cerrar su ciclo. Las mismas herramientas de
optimización y planificación que resuelven el loop lunar son las que necesita la
Tierra para cerrar sus propios loops hídricos.

---

*NASA Space Apps Challenge · Noviembre 14–15, 2026*
