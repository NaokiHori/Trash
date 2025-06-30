# Tangent Hyperbolic INterface Capturing Method

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
c H_{i - \frac{1}{2}}.
```

$H$ is called the indicator function.
Numerically the indicator function is piecewise and is defined for each cell center $\mathcal{H}_i$.
To obtain values at cell faces, we should use the upwind value; namely:

```math
H_{i - \frac{1}{2}}
=
\begin{cases}
\mathcal{H}_{i - 1} \left( \frac{1}{2} \right) & 0 < c, \\
\mathcal{H}_i \left( - \frac{1}{2} \right) & c < 0,
\end{cases}
```

The piecewise indicator function for each cell center $i$ is specifically given by:

```math
\mathcal{H}_i
\left( \xi \right)
=
\frac{1}{2} \left[
    1
    +
    \tanh \left\{
        \beta
        p_i \left( \xi \right)
    \right\}
\right],
```

where $\beta$ is a free parameter which determines the sharpness of the surface.
$p_i$ is the surface function defined for each cell center again and is given by:

```math
p_i \left( \xi \right)
\equiv
n_i
\xi
+
\psi_i
```

with $n_i$ being the normal vector while $\psi_i$ being the signed distance function:

```math
\psi_i
\equiv
-
\frac{1}{2 \beta}
\log \left(
    \frac{1}{\phi_i}
    -
    1
\right).
```

## Reference

- Xie and Xiao, _J. Comput. Phys_ (**349**), 2017
