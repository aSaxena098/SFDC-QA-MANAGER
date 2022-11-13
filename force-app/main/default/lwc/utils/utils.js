export function exportCSVFile(headers,totalData,fileTitle){
    if(!totalData || !totalData.length){
        return null;
    }
    const jsonObject = JSON.stringify(totalData);
    const result = convertToCSV(jsonObject,headers);
    if(result==null) return;
    const blob = new Blob([result]);
    const exportedFileName = fileTitle+'.csv';

    const link = document.createElement("a");
    if(link.download != undefined){
        const url = URL.createObjectURL(blob);
        link.setAttribute("href",url);
        link.setAttribute("download",exportedFileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}


function convertToCSV(objArr,headers){
    const columnDelimiter = ',';
    const lineDelimiter = '\r\n';
    const actualHeaderKey = Object.keys(headers);
    const headersToShow = Object.values(headers);

    let str = '';
    str+=headersToShow.join(columnDelimiter);
    str+=lineDelimiter;
    
    const data = typeof objArr!='object' ? JSON.parse(objArr):objArr;
    data.forEach(obj => {
        let line = '';
        actualHeaderKey.forEach(key=>{
            if(line!=''){
                line+=columnDelimiter;
            }
            line+=obj[key];
        })
        str+=line+lineDelimiter
        
    });
    console.log("str",str);
    return str;
}