# Mathematical Formulation

We consider the one-dimensional advection equation:

```math
\frac{\partial \phi}{\partial t}
=
-
c
\frac{\partial \phi}{\partial x},
```

where $\phi$ denotes the convected quantity containing discontinuities, and $c$ is the constant velocity.

The goal of this package is to demonstrate and compare the performance of various numerical methods for integrating this partial differential equation over time.

For simplicity, we consistently use the explicit Euler scheme for time integration:

```math
\frac{\phi^{n + 1} - \phi^n}{\Delta t}
=
-
c
\frac{\partial \phi^n}{\partial x},
```

which allows us to isolate and purely compare the effects of different spatial discretization methods.

Note that we impose the periodic boundary condition.
