# Accurate and Conservative Diffusive Interface Method

The one-dimensional advection equation is spatially discretized as:

```math
\frac{\phi_i^{n + 1} - \phi_i^n}{\Delta t}
=
-
\frac{
    f_{i+\frac{1}{2}}^n
    -
    f_{i-\frac{1}{2}}^n
}{\Delta x},
```

where $f_{i \pm \frac{1}{2}}$ is the flux defined as:

```math
f_{i - \frac{1}{2}}
\equiv
c \overline{\phi}
-
\Gamma \epsilon \frac{\delta \phi}{\delta x}
+
\Gamma \frac{1}{4} \left[ 1 - \left\{ \tanh \left( \frac{1}{2 \epsilon} \overline{\psi} \right) \right\}^2 \right] n.
```

Several symbols are introduced for notational simplicity, which are defined as follows:

```math
\overline{\varphi}
\equiv
\frac{
    \varphi_{i - 1}
    +
    \varphi_i
}{2},
```

```math
\delta{\varphi}
\equiv
\varphi_i
-
\varphi_{i - 1},
```

```math
\psi
\equiv
\epsilon
\log
\frac{
    \phi
}{
    1 - \phi
},
```

and

```math
n
\equiv
\frac{\delta \psi}{\delta x}.
```

$\Gamma$ and $\epsilon$ are free parameter to be prescribed, which are fixed to $1$ and $3 \Delta x / 4$ in this project.

## Reference

- Jain, _J. Comput. Phys_ (**469**), 2022
