# Cart Pole Controller

A cart-pole system (inverted pendulum) with PD controller.

## Equation

We consider a cart-pole system, whose governing equation is derived by considering the stationary condition of the Lagrangian.
The position vectors are

```math
\vec{x}_c
=
x_c \vec{e}_x,
```

```math
\vec{x}_p
=
\left( x_c + l \cos \theta \right) \vec{e}_x
+
l \sin \theta \vec{e}_y,
```

where subscripts are used to distinguish cart (`c`) and pendulum (`p`).
The derivatives lead to

```math
\vec{\dot{x}}_c
=
\dot{x}_c \vec{e}_x,
```

```math
\vec{\dot{x}}_p
=
\left( \dot{x}_c - l \dot{\theta} \sin \theta \right) \vec{e}_x
+
l \dot{\theta} \cos \theta \vec{e}_y.
```

which are used to compute the Lagrangian:

```math
L
\equiv
T
-
U
=
\frac{1}{2} m_c \vec{\dot{x}}_c \cdot \vec{\dot{x}}_c
+
\frac{1}{2} m_p \vec{\dot{x}}_p \cdot \vec{\dot{x}}_p
+
m_p g l \sin \theta.
```

The Euler-Lagrange equations are:

```math
\begin{pmatrix}
    m_c + m_p & - m_p l \sin \theta \\
    - \sin \theta & l
\end{pmatrix}
\begin{pmatrix}
    \ddot{x}_c \\
    \ddot{\theta}
\end{pmatrix}
=
\begin{pmatrix}
    m_p l \left( \dot{\theta} \right)^2 \cos \theta + f \\
    g \cos \theta
\end{pmatrix},
```

where $f$ is the external force acting on the cart to controll the system.

## PD Control

We aim to keep the pendulum at the unstable equilibrium position $\theta = \pi / 2$ (or $\phi \equiv \theta - \pi / 2 = 0$) by adopting PD control.

### Linearized equation

To begin with, we consider small perturbation around $\phi = \epsilon$ using the linearized equation:

```math
\begin{pmatrix}
    m_c + m_p & - m_p l \\
    - 1 & l
\end{pmatrix}
\begin{pmatrix}
    \ddot{x}_c \\
    \ddot{\phi}
\end{pmatrix}
=
\begin{pmatrix}
    f \\
    - g \phi
\end{pmatrix},
```

where $\sin \phi \approx \phi$ and $\cos \phi \approx 1$ are adopted and the higher-order term involving $\left( \dot{\phi} \right)^2 \phi$ is dropped.

### Transfer function

We compute the Laplace transform:

```math
X \left( s \right)
\equiv
\mathcal{L} \left[ x \left( t \right) \right]
\equiv
\int_{0}^{\infty} x \exp \left( - s t \right) dt
```

of the linearized equation.
By using

```math
\mathcal{L} \left[ \ddot{x} \right]
=
s^2 X
-
s x \left( 0 \right)
-
\dot{x} \left( 0 \right),
```

we obtain

```math
\begin{pmatrix}
    s^2 \left( m_c + m_p \right) & - s^2 m_p l \\
    - s^2 & s^2 l
\end{pmatrix}
\begin{pmatrix}
    X_c \\
    \Phi
\end{pmatrix}
=
\begin{pmatrix}
    F \\
    - g \Phi
\end{pmatrix},
```

where capital letters denote Laplace-transformed variables.
Note that we let the initial values to be zero following the definition of the transfer function.

With this, the transfer function of the linearized system leads to

```math
\frac{\Phi}{F}
=
\frac{
    1
}{
    m_c l s^2
    +
    \left( m_c + m_p \right) g
},
```

```math
\frac{X_c}{F}
=
\left( l + \frac{g}{s^2} \right)
\frac{\Phi}{F}.
```

### Controller and poles

We consider a PD control:

```math
f \left( t \right)
=
-
C_p \phi
-
C_d \dot{\phi}
-
D_p x_c
-
D_d \dot{x}_c,
```

whose Laplace transform leads to

```math
F
=
-
C_p \Phi
-
s C_d \Phi
-
D_p X
-
s D_d X.
```

The linearized system leads to

```math
\begin{pmatrix}
    s^2 \left( m_c + m_p \right) + D_p + s D_d & - s^2 m_p l + C_p + s C_d \\
    - s^2 & s^2 l + g
\end{pmatrix}
\begin{pmatrix}
    X_c \\
    \Phi
\end{pmatrix}
=
\begin{pmatrix}
    0 \\
    0
\end{pmatrix},
```

whose determinant gives the characteristic equation of the closed-loop system:

```math
m_c l
s^4
+
\left( l D_d + C_d \right)
s^3
+
\left( m_c g + m_p g + l D_p + C_p \right)
s^2
+
D_d g
s
+
D_p g
=
0.
```

The solutions of this equation are poles, and we request them to lie in the left-half of the complex plane to keep the linearized system stable.

### Stability

Although analytical solution of the above quartic equation exists, it is cumbersome to calculate.
To evaluate the stability of the system, we use Routh-Hurwitz criterion, requesting that the following values are all positive:

```math
\left( l D_d + C_d \right) \left( m_c g + m_p g + l D_p + C_p \right)
-
m_c l D_d g,
```

```math
\left( l D_d + C_d \right) \left( m_c g + m_p g + l D_p + C_p \right) D_d g
-
m_c l D_d^2 g^2
-
\left( l D_d + C_d \right)^2 D_p g,
```

in addition to the all prefactors of the quartic polynomial being positive.

### Pole placement

Although the stability criteria is specified in the previous part, finding a suitable parameter set using the equations is non-trivial.
To find a set of desired parameters, we take a different approach.

First, the linearized system is written as:

```math
\begin{pmatrix}
    \dot{x}_c \\
    \ddot{x}_c \\
    \dot{\phi} \\
    \ddot{\phi}
\end{pmatrix}
=
\begin{pmatrix}
    0 & 1 & 0 & 0 \\
    0 & 0 & - g \frac{m_p}{m_c} & 0 \\
    0 & 0 & 0 & 1 \\
    0 & 0 & - \frac{g}{l} \left( 1 + \frac{m_p}{m_c} \right) & 0
\end{pmatrix}
\begin{pmatrix}
    x_c \\
    \dot{x}_c \\
    \phi \\
    \dot{\phi}
\end{pmatrix}
+
\begin{pmatrix}
    0 \\
    \frac{1}{m_c} \\
    0 \\
    \frac{1}{m_c l}
\end{pmatrix}
f,
```

or by defining some symbols for later convenience:

```math
\vec{\dot{z}}
=
\boldsymbol{A}
\vec{z}
+
\vec{b}
f.
```

Since the external force $f$ is controlled by the state:

```math
f
=
-
\vec{k}
\cdot
\vec{z}
=
-
\begin{pmatrix}
    D_p & D_d & C_p & C_d
\end{pmatrix}
\begin{pmatrix}
    x_c \\
    \dot{x}_c \\
    \phi \\
    \dot{\phi}
\end{pmatrix},
```

we obtain

```math
\vec{\dot{z}}
=
\left(
    \boldsymbol{A}
    -
    \vec{b}
    \vec{k}
\right)
\vec{z}.
```

Our objective here is to adjust $\vec{k}$ such that the eigenvalues of the matrix:

```math
\boldsymbol{A}
-
\vec{b} \vec{k}
=
\begin{pmatrix}
    0 & 1 & 0 & 0 \\
    - \frac{D_p}{m_c} & - \frac{D_d}{m_c} & - g \frac{m_p}{m_c} - \frac{C_p}{m_c} & - \frac{C_d}{m_c} \\
    0 & 0 & 0 & 1 \\
    - \frac{D_p}{m_c l} & - \frac{D_d}{m_c l} & - \frac{g}{l} \left( 1 + \frac{m_p}{m_c} \right) - \frac{C_p}{m_c l} & - \frac{C_d}{m_c l}
\end{pmatrix}
```

coincides with the desired ones.
This is achieved by utilizing the Ackermann's formula:

```math
\begin{pmatrix}
    D_p & D_d & C_p & C_d
\end{pmatrix}
=
\begin{pmatrix}
    0 & 0 & 0 & 1
\end{pmatrix}
\boldsymbol{C}^{-1}
\left(
    \alpha^4 A^4
    +
    \alpha_3 A^3
    +
    \alpha_2 A^2
    +
    \alpha_1 A
    +
    \alpha_0 I
\right),
```

where

```math
\boldsymbol{C}
\equiv
\begin{pmatrix}
    \vec{b} & \boldsymbol{A} \cdot \vec{b} & \boldsymbol{A}^2 \cdot \vec{b} & \boldsymbol{A}^3 \cdot \vec{b}
\end{pmatrix}
```

is the controllability matrix, and $\alpha_n$ are the $n$-th order coefficients of the quartic function:

```math
\left( s^2 + 2 \eta_c \omega_c + \omega_c^2 \right)
\left( s^2 + 2 \eta_p \omega_p + \omega_p^2 \right).
```

Here, $\eta_i$ and $\omega_i$ denote damping ratio and angular frequency, respectively, which are both input parameters.
Note that using larger values leads to less-overshooting / undershooting trend and faster convergence, but less stable at the same time.

## Swing-up mode

TBA

## Reference

- [Routh–Hurwitz stability criterion - Wikipedia](https://en.wikipedia.org/w/index.php?title=Routh%E2%80%93Hurwitz_stability_criterion&oldid=1371517128)
- [Ackermann's formula - Wikipedia](https://en.wikipedia.org/w/index.php?title=Ackermann%27s_formula&oldid=1369142753)
