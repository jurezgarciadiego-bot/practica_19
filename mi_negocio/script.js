const productosCompra = [
    { precio: 350, cantidadId: "cantidad-1", subtotalId: "subtotal-1" },
    { precio: 400, cantidadId: "cantidad-2", subtotalId: "subtotal-2" },
    { precio: 300, cantidadId: "cantidad-3", subtotalId: "subtotal-3" },
    { precio: 250, cantidadId: "cantidad-4", subtotalId: "subtotal-4" },
    { precio: 450, cantidadId: "cantidad-5", subtotalId: "subtotal-5" },
    { precio: 300, cantidadId: "cantidad-6", subtotalId: "subtotal-6" }
];

function claveCantidad(producto) {
    return "mi-negocio:" + location.pathname + ":" + producto.cantidadId;
}

function activarGuardadoPedido() {
    for (const producto of productosCompra) {
        const campo = document.getElementById(producto.cantidadId);
        campo.addEventListener("input", () => {
            const clave = claveCantidad(producto);
            if (campo.value === "" || !campo.validity.valid) {
                localStorage.removeItem(clave);
                return;
            }
            localStorage.setItem(clave, campo.value);
        });
    }
}

function calcularCompra() {
    let total = 0;

    for (const producto of productosCompra) {
        const campo = document.getElementById(producto.cantidadId);
        const cantidad = Number(campo.value);

        if (
            campo.value.trim() === "" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0
        ) {
            alert("Escribe cantidades enteras iguales o mayores que cero.");
            campo.focus();
            return null;
        }

        const subtotal = producto.precio * cantidad;

        document.getElementById(producto.subtotalId).textContent =
            subtotal.toFixed(2);

        total += subtotal;
    }

    return total;
}

function actualizarResumenCompra() {
    const importe = calcularCompra();
    if (importe === null) return;

    let descuento = 0;
    if (importe >= 1000) {
        descuento = importe * 0.10;
    } else {
        descuento = 0;
    }

    const totalPagar = importe - descuento;

    document.getElementById("importe-compra").textContent =
        importe.toFixed(2);
    document.getElementById("descuento-compra").textContent =
        descuento.toFixed(2);
    document.getElementById("total-compra").textContent =
        totalPagar.toFixed(2);
}

function recuperarPedido() {
    for (const producto of productosCompra) {
        const campo = document.getElementById(producto.cantidadId);
        const guardada = localStorage.getItem(claveCantidad(producto));
        campo.value = guardada ?? "0";
        if (campo.value === "" || !campo.validity.valid) {
            campo.value = "0";
        }
    }
    actualizarResumenCompra();
}

function vaciarPedido() {
    for (const producto of productosCompra) {
        localStorage.removeItem(claveCantidad(producto));
    }
    recuperarPedido();
}

const botonCalcularPedido = document.getElementById("calcular-compra");
const botonVaciarPedido = document.getElementById("vaciar-pedido");

if (botonCalcularPedido) {
    botonCalcularPedido.addEventListener("click", actualizarResumenCompra);
    activarGuardadoPedido();
    recuperarPedido();
}

if (botonVaciarPedido) {
    botonVaciarPedido.addEventListener("click", vaciarPedido);
}
