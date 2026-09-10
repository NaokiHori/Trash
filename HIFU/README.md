# HIFU

Showing time-averaged pressure distribution of HIFU (high-intensity focused ultrasound) systems in 2D.

## Method

We consider a superposition of two waves having the same frequency:

```math
A e^{i \left( \omega t + \phi_a \right)}
+
B e^{i \left( \omega t + \phi_b \right)},
```

which leads to

```math
\left[
    \left\{ A \cos \left( \phi_a \right) + B \cos \left( \phi_b \right) \right\}
    +
    i
    \left\{ A \sin \left( \phi_a \right) + B \sin \left( \phi_b \right) \right\}
\right]
e^{i \omega t}.
```

Thus, to compute the superposition at a location incrementally, we use:

```math
\Re \left( A_{n + 1} \right)
\leftarrow
A_n \cos \left( \phi_n \right) + A \cos \left( \phi \right)
=
\Re \left( A_n \right) + A \cos \left( \phi \right),
```

```math
\Im \left( A_{n + 1} \right)
\leftarrow
A_n \sin \left( \phi_n \right) + A \sin \left( \phi \right)
=
\Im \left( A_n \right) + A \sin \left( \phi \right).
```
