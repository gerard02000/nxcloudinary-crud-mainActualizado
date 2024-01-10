'use client'
// Drag and Drop: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

export function dragOverHandler(ev) {
    ev.preventDefault();
}

export function dropHandler(ev) {
    ev.preventDefault();
    const imgPreview = ev.target;
    const fileInput = ev.target.nextSibling;
    // console.dir(ev.target)

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items are files ...
            if (item.kind === "file") {
                const file = item.getAsFile();
                fileInput.files = ev.dataTransfer.files;  // IMPORTANTE: Copia imagen al input type='file'

                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () =>  imgPreview.src = reader.result
            }
        });
    } 
}
