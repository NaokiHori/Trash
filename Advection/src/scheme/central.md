# Second-order accurate central finite-difference scheme

The one-dimensional advection equation is spatially discretized as:

```math
\frac{\phi_i^{n + 1} - \phi_i^n}{\Delta t}
=
-
c
\frac{\phi_{i+1}^n - \phi_{i-1}^n}{2 \Delta x}.
```
