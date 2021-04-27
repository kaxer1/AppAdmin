import { toast } from 'react-toastify';

export function SoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key === especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) === -1 && !tecla_especial) {
        toast.warn('No se admite datos numéricos', {position: 'top-right'})
        e.preventDefault();
    }
}

export function SoloNumeros(evt) {
    if (!/[0-9]/.test(evt.key)) {
        toast.warn('No se admite el ingreso de letras', {position: 'top-right'})
        evt.preventDefault();
    }
}