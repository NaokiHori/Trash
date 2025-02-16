# Julia Set Viewer

A visualization of the Julia set using the orbit trap method.

## Mathematical Formulation

We consider a recurrence relation in the complex plane:

```math
p_{ij}^{n + 1}
=
\left( p_{ij}^{n} \right)^2
+
p_o,
```

where $p_o$ is a given parameter, and $p_{ij}^0$ represents the coordinate of the pixel located at $(i, j)$.

At each iteration, we compute the signed distance from a circle as follows:

```math
d^{n}
=
R
-
\left| p_{ij}^{n} - p_c \right|,
```

where $R$ and $p_c$ denote the radius and center of the circle, respectively.

The minimum absolute distance:

```math
\min_{\forall n} \left( \left| d^{n} \right| \right)
```

is used to determine the pixel color.
