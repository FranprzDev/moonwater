# MOONWATER 🌙💧

**Agua en la Luna. Nosotros vamos a buscarla.**

Simulador 3D interactivo de una base lunar autosustentable, centrada en el recurso más valioso de la exploración espacial: el agua.

## ¿Qué es?

Una experiencia en dos capas:

### 🌌 Landing narrativa
Un viaje espacial renderizado en tiempo real (WebGL) y ligado al scroll: partís desde la Tierra, cruzás el espacio profundo con Marte y un gigante gaseoso en el camino, y aterrizás en la Luna — donde te espera la base.

### 🛰️ Simulador paramétrico
La base lunar completa funcionando en vivo:

- **Pozo de hielo** en una Región de Sombra Permanente (PSR), con torre de perforación y sonda térmica
- **Planta ISRU**: reactor LADI, electrólisis PEM, tanques criogénicos de H₂/O₂ y radiadores
- **Hábitat presurizado** con túnel de acople, invernadero y airlock
- **Circuito de tuberías** con flujo de agua animado entre estaciones
- **Rover minero** con cinemática realista (ruedas, polvo, trayectorias suaves)
- Balance de masa y energía en tiempo real con datos NASA

### ⚔️ Modo competitivo
Sobreviví **30 días lunares** manteniendo el banco de agua por encima de cero y el margen energético sin colapsar. El puntaje premia la cobertura de demanda, el agua acumulada y la eficiencia. Récord local incluido: competí contra tu equipo, tu clase o el mundo.

## La ciencia

El agua lunar no es especulación: fue confirmada por LCROSS (2009), mapeada por Chandrayaan-1/Mini-SAR y LRO, y validada por SOFIA (2020). Está en los cráteres polares que nunca reciben luz solar, y es simultáneamente bebida, oxígeno respirable y combustible. Extraerla en el lugar (*ISRU*) es la clave para quedarse.

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

Build de producción:

```bash
npm run build
```

---

*Datos: NASA LCROSS · Lunar Reconnaissance Orbiter · Chandrayaan-1 · ISS ECLSS*
