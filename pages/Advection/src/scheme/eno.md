# Essentially Non-Oscillatory Scheme

## Method

We consider a time-discretized one-dimensional advection equation:

```math
\frac{\phi_i^{n + 1} - \phi_i^n}{\Delta t}
=
-
u
\frac{
    H \left( x_{i + \frac{1}{2}} \right)
    -
    H \left( x_{i - \frac{1}{2}} \right)
}{\Delta x},
```

where we define the cell-averaged value of the transported scalar `H`:

```math
\phi_i
\equiv
\frac{1}{\Delta x}
\int_{x_{i - \frac{1}{2}}}^{x_{i + \frac{1}{2}}}
H \left( x \right)
dx.
```

To evaluate the flux

```math
u H \left( x_{i + \frac{1}{2}} \right)
```

or more specifically the cell-faced value of `H`, there are four possible combinations of the cell-averaged values (known as "stencils") to be used to construct a third-order accurate evaluation:

```math
\left( \phi_{i - 2}, \phi_{i - 1}, \phi_i \right),
```

```math
\left( \phi_{i - 1}, \phi_i, \phi_{i + 1} \right),
```

```math
\left( \phi_i, \phi_{i + 1}, \phi_{i + 2} \right),
```

and

```math
\left( \phi_{i + 1}, \phi_{i + 2}, \phi_{i + 3} \right).
```

The "best" stencil is determined as the following sequential manner.
First, depending on the sign of (local) advection velocity `u`, we pick up the upwind cell; namely `i + 1` if the velocity is negative, otherwise `i`, which is the "base" stencil whose size is 1.

Then, to improve the accuracy of the interpolation / extrapolation, we append one of the neighboring cells and extend the size of the stencil.
For example, when the first stencil is

```math
\left( \phi_i \right),
```

there are two candidates as the new stencil of size 2:

```math
\left( \phi_{i - 1}, \phi_i \right)
```

or

```math
\left( \phi_i, \phi_{i + 1} \right).
```

The superiority is based on the absolute value of divided difference

```math
D \left[ \phi_a, \phi_b \right]
\equiv
\frac{
    \phi_b
    -
    \phi_a
}{
    \Delta x
},
```

which measures how discontinuous the signal inside each stencil is; namely, the smaller the smoother (more preferable).

This process is repeated once again (or for many times as we want).
For example, when the second stencil is

```math
\left( \phi_{i - 1}, \phi_i \right),
```

the candidates are one of

```math
\left( \phi_{i - 2}, \phi_{i - 1}, \phi_i \right)
```

or

```math
\left( \phi_{i - 1}, \phi_i, \phi_{i + 1} \right).
```

To choose one, we use the absolute value of divided difference:

```math
D \left[ \phi_a, \phi_b, \phi_c \right]
\equiv
\frac{
    D \left[ \phi_b, \phi_c \right]
    -
    D \left[ \phi_a, \phi_b \right]
}{
    2 \Delta x
}.
```

With the best stencil found, the cell-faced scalar can be computed as the linear combination of the cell-averaged values:

```math
H \left( x_{i + \frac{1}{2}} \right)
\approx
\sum_n
w_n
\phi_n.
```

More concretely, we use one of:

```math
H \left( x_{i + \frac{1}{2}} \right)
\approx
\frac{2}{6} \phi_{i - 2} - \frac{7}{6} \phi_{i - 1} + \frac{11}{6} \phi_i,
```

```math
H \left( x_{i + \frac{1}{2}} \right)
\approx
- \frac{1}{6} \phi_{i - 1} + \frac{5}{6} \phi_i + \frac{2}{6} \phi_{i + 1},
```

```math
H \left( x_{i + \frac{1}{2}} \right)
\approx
\frac{2}{6} \phi_i + \frac{5}{6} \phi_{i + 1} - \frac{1}{6} \phi_{i + 2},
```

```math
H \left( x_{i + \frac{1}{2}} \right)
\approx
\frac{11}{6} \phi_{i + 1} - \frac{7}{6} \phi_{i + 2} + \frac{2}{6} \phi_{i + 3}.
```

## Appendix: proof of third-order accuracy

Since the linear combinations are not function of `x` explicitly, we let

```math
x_{i + 1 / 2} = 0
```

for brevity.

The Maclaurin expansion leads to

```math
H \left( x \right)
=
H \left( 0 \right)
+
H^{\prime} \left( 0 \right) x
+
\frac{1}{2} H^{\prime\prime} \left( 0 \right) x^2
+
\frac{1}{6} H^{\left( 3 \right)} \left( 0 \right) x^3
+
\mathcal{O} \left( x^4 \right),
```

which is used to describe the cell-centered values, e.g.:

```math
\phi_i
=
\frac{1}{\Delta x}
\int_{-\Delta x}^{0} H \left( x \right) dx.
```

Evaluating the integral and weighted-averaging them shows that the above four relations all have third-order accuracy in space.

```python
from fractions import Fraction
from typing import Self


class Coefs:
    def from_series(a: Fraction, b: Fraction) -> Self:
        return Coefs(
            b - a,
            (b**2 - a**2) / 2,
            (b**3 - a**3) / 6,
            (b**4 - a**4) / 24,
        )

    def __init__(
        self, coef0: Fraction, coef1: Fraction, coef2: Fraction, coef3: Fraction
    ):
        self.coef0 = coef0
        self.coef1 = coef1
        self.coef2 = coef2
        self.coef3 = coef3

    def __add__(self, another: Self) -> Self:
        return Coefs(
            self.coef0 + another.coef0,
            self.coef1 + another.coef1,
            self.coef2 + another.coef2,
            self.coef3 + another.coef3,
        )

    def __mul__(self, scalar: Fraction) -> Self:
        return Coefs(
            self.coef0 * scalar,
            self.coef1 * scalar,
            self.coef2 * scalar,
            self.coef3 * scalar,
        )


def check_result(phis: list[Coefs], weights: list[Fraction]):
    weighted_values = [
        phis[0] * weights[0],
        phis[1] * weights[1],
        phis[2] * weights[2],
    ]
    result = weighted_values[0] + weighted_values[1] + weighted_values[2]
    assert result.coef0 == 1
    assert result.coef1 == 0
    assert result.coef2 == 0
    assert result.coef3 != 0


def main():
    check_result(
        phis=[
            Coefs.from_series(Fraction(-3), Fraction(-2)),
            Coefs.from_series(Fraction(-2), Fraction(-1)),
            Coefs.from_series(Fraction(-1), Fraction(0)),
        ],
        weights=[Fraction(1, 3), -Fraction(7, 6), Fraction(11, 6)],
    )
    check_result(
        phis=[
            Coefs.from_series(Fraction(-2), Fraction(-1)),
            Coefs.from_series(Fraction(-1), Fraction(0)),
            Coefs.from_series(Fraction(0), Fraction(1)),
        ],
        weights=[-Fraction(1, 6), Fraction(5, 6), Fraction(1, 3)],
    )
    check_result(
        phis=[
            Coefs.from_series(Fraction(-1), Fraction(0)),
            Coefs.from_series(Fraction(0), Fraction(1)),
            Coefs.from_series(Fraction(1), Fraction(2)),
        ],
        weights=[Fraction(1, 3), Fraction(5, 6), -Fraction(1, 6)],
    )
    check_result(
        phis=[
            Coefs.from_series(Fraction(0), Fraction(1)),
            Coefs.from_series(Fraction(1), Fraction(2)),
            Coefs.from_series(Fraction(2), Fraction(3)),
        ],
        weights=[Fraction(11, 6), -Fraction(7, 6), Fraction(1, 3)],
    )


main()
```

## Reference

- Harten et al., _J. Comput. Phys._ (**71**), 1987
- Zhang and Shu, _Handb. Numer. Anal._ (**17**), 2016
