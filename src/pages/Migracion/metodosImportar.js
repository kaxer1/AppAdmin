import { toast } from 'react-toastify';

const importarExcel =  (metodo_name, path , optionsQueryFT3, setMigrado, setProgress, setShowMessageMigration) => {
    setProgress(true);
    window.api.send(`Api/import/${metodo_name}`, { path, optionsQueryFT3 });
    window.api.receive(`import/${metodo_name}`, (data) => {
        console.log(data);
        setProgress(false)
        setShowMessageMigration(true);
        if (!data.err) {
            setMigrado(true) 
            toast.success(data.message)
        } else {
            setMigrado(false) 
            toast.error(data.err)
        }
    });
}

const handlerChange = (e, setActiveBtn, setPath, resetUseState) => {
    if (e.target.files[0] !== undefined) {
        const { path } = e.target.files[0];
        console.log(e.target.files[0]);
        setPath(path)
        setActiveBtn(true)  
    } else {
        resetUseState();
    }
}

export const camposExp = [
    {   id: 1, metodo_name: 'Empresa', importarExcel, handlerChange },
    {   id: 2, metodo_name: 'Sucursal', importarExcel, handlerChange },
    {   id: 3, metodo_name: 'Cargos', importarExcel, handlerChange },
    {   id: 4, metodo_name: 'Departamentos', importarExcel, handlerChange},
    {   id: 5, metodo_name: 'Empleados', importarExcel, handlerChange },
    {   id: 6, metodo_name: 'Timbres', importarExcel, handlerChange }
];

export default { camposExp }