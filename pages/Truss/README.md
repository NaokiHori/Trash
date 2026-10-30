# Truss

A minimal finite-element solver to compute deformation of truss bridges.

## Method

We consider a set of nodes connected by one-dimensional elements that deform (stretch or compress) exclusively in the axial direction.
For simplicity, we assume the elements cannot transmit non-axial forces or bending moments.

## Equations

We consider a one-dimensional element with two end nodes, $\xi_i$, where the subscript distinguishes the boundary nodes.
The force balance for these two nodes expressed in the local coordinate system yields:

```math
\begin{pmatrix}
    \phi_0 \\
    \phi_1
\end{pmatrix}
=
\frac{
    E A
}{
    L
}
\begin{pmatrix}
    -1 & 1 \\
    1 & -1
\end{pmatrix}
\begin{pmatrix}
    \delta_0 \\
    \delta_1
\end{pmatrix},
```

where $\phi_i$ and $\delta_i$ denote force and displacement, respectively.
Greek letters represent variables defined in the local coordinate system, whereas Latin lowercase letters denote variables defined in Cartesian coordinates.

To express this relationship in Cartesian coordinates, we apply the coordinate transformation:

```math
\vec{a}
=
\alpha \vec{e}_{\xi}
=
a_x \vec{e}_x
+
a_y \vec{e}_y,
```

which gives:

```math
\begin{pmatrix}
    a_x \\
    a_y
\end{pmatrix}
=
\alpha
\begin{pmatrix}
    \frac{x_1 - x_0}{L} \\
    \frac{y_1 - y_0}{L}
\end{pmatrix}
\equiv
\alpha
\begin{pmatrix}
    C \\
    S
\end{pmatrix}.
```

Using this relationship, we write the vector components at the element ends as:

```math
\begin{pmatrix}
    C & 0 \\
    S & 0 \\
    0 & C \\
    0 & S \\
\end{pmatrix}
\begin{pmatrix}
    \alpha_0 \\
    \alpha_1
\end{pmatrix}
=
\begin{pmatrix}
    a_{0x} \\
    a_{0y} \\
    a_{1x} \\
    a_{1y}
\end{pmatrix},
```

or in inverse form:

```math
\begin{pmatrix}
    C & S & 0 & 0 \\
    0 & 0 & C & S
\end{pmatrix}
\begin{pmatrix}
    a_{0x} \\
    a_{0y} \\
    a_{1x} \\
    a_{1y}
\end{pmatrix}
=
\begin{pmatrix}
    \alpha_0 \\
    \alpha_1
\end{pmatrix}.
```

Substituting this relationship into the force balance yields:

```math
\begin{pmatrix}
    f_{0x} \\
    f_{0y} \\
    f_{1x} \\
    f_{1y}
\end{pmatrix}
=
\frac{
    E A
}{
    L
}
\begin{pmatrix}
    C & S & 0 & 0 \\
    0 & 0 & C & S
\end{pmatrix}^{-1}
\begin{pmatrix}
    -1 & 1 \\
    1 & -1
\end{pmatrix}
\begin{pmatrix}
    C & S & 0 & 0 \\
    0 & 0 & C & S
\end{pmatrix}
\begin{pmatrix}
    d_{0x} \\
    d_{0y} \\
    d_{1x} \\
    d_{1y}
\end{pmatrix},
```

which simplifies to:

```math
\frac{
    E A
}{
    L
}
\begin{pmatrix}
    C^2 & C S & - C^2 & - C S \\
    C S & S^2 & - C S & - S^2 \\
    - C^2 & - C S & C^2 & C S \\
    - C S & - S^2 & C S & S^2 \\
\end{pmatrix}
\begin{pmatrix}
    d_{0x} \\
    d_{0y} \\
    d_{1x} \\
    d_{1y}
\end{pmatrix}
=
\begin{pmatrix}
    f_{0x} \\
    f_{0y} \\
    f_{1x} \\
    f_{1y}
\end{pmatrix}.
```

Consequently, the element stiffness matrix (relating applied forces to displacements) is defined as:

```math
\boldsymbol{K}_e
\equiv
\frac{
    E A
}{
    L
}
\begin{pmatrix}
    C^2 & C S & - C^2 & - C S \\
    C S & S^2 & - C S & - S^2 \\
    - C^2 & - C S & C^2 & C S \\
    - C S & - S^2 & C S & S^2 \\
\end{pmatrix}.
```

## Reference

- [Truss bridge - Wikipedia](https://en.wikipedia.org/wiki/Truss_bridge)
