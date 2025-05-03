document.addEventListener("DOMContentLoaded", () => {
    const ingresosInput = document.getElementById("ingresos");
    const gastosInputs = document.querySelectorAll(".input-gastos");
    const gastosAcumuladosElement = document.getElementById("gastos-acumulados");

    function formatNumber(value) {
        return value.replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function validateNumber(input) {
        let rawValue = input.value.replace(/\D/g, "");
        rawValue = rawValue.replace(/^0+/, "");
        input.value = formatNumber(rawValue);
    }

    ingresosInput.addEventListener("input", () => validateNumber(ingresosInput));

    gastosInputs.forEach((input) => {
        input.addEventListener("input", () => validateNumber(input));
    });

    function updateGastosAcumulados() {
        const totalGastos = Array.from(gastosInputs).reduce((sum, input) => {
            const gasto = Number(input.value.replace(/\./g, ""));
            return sum + gasto;
        }, 0);

        gastosAcumuladosElement.textContent = formatNumber(totalGastos.toString());
    }

    function validateGastosVsIngresos() {
        const ingresosValue = Number(ingresosInput.value.replace(/\./g, ""));
        if (!ingresosValue || ingresosValue <= 0) {
            alert("Debes ingresar un valor válido y mayor a cero en el campo de ingresos para poder registrar los gastos.");
            gastosInputs.forEach((input) => input.value = "");
            updateGastosAcumulados();
            return;
        }

        let totalGastos = Array.from(gastosInputs).reduce((sum, input) => {
            const gasto = Number(input.value.replace(/\./g, ""));
            return sum + gasto;
        }, 0);

        if (totalGastos > ingresosValue) {
            alert("El total de gastos no puede superar los ingresos.");

            let eliminados = [];

            for (let i = gastosInputs.length - 1; i >= 0 && totalGastos > ingresosValue; i--) {
                const input = gastosInputs[i];
                const gasto = Number(input.value.replace(/\./g, ""));
                if (gasto > 0) {
                    eliminados.push(input.dataset.label || `Campo ${i + 1}`);
                    input.value = "";
                    totalGastos -= gasto;
                }
            }

            if (eliminados.length > 0) {
                alert(`Se eliminarán automáticamente los valores de los siguientes campos para no superar los ingresos:\n\n- ${eliminados.join('\n- ')}`);
            }
        }

        updateGastosAcumulados();
    }

    ingresosInput.addEventListener("input", validateGastosVsIngresos);
    gastosInputs.forEach((input) => {
        input.addEventListener("input", validateGastosVsIngresos);
    });
});