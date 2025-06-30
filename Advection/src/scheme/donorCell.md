# Donor-cell scheme

The one-dimensional advection equation is spatially discretized as:

```math
\frac{\phi_i^{n + 1} - \phi_i^n}{\Delta t}
=
-
c
\frac{\phi_{i+1}^n - \phi_i^n}{\Delta x}
```

and

```math
\frac{\phi_i^{n + 1} - \phi_i^n}{\Delta t}
=
-
c
\frac{\phi_i^n - \phi_{i-1}^n}{\Delta x}
```

if $c < 0$ and $0 < c$, respectively.
