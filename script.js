function formatDocument(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd);
    }
}

function addLink() {
    const url = prompt('Ingrese una URL');
    if (url) {
        formatDocument('createLink', url);
    }
}

const content = document.getElementById('content');
const fileName = document.getElementById('fileName');

// Cargar contenido y título guardados
window.onload = function() {
    const savedContent = localStorage.getItem('documentContent');
    const savedTitle = localStorage.getItem('documentTitle');

    if (savedContent) {
        content.innerHTML = savedContent;
    }
    if (savedTitle) {
        fileName.value = savedTitle;
    }
};

// Guardar contenido y título al salir
window.onbeforeunload = function() {
    localStorage.setItem('documentContent', content.innerHTML);
    localStorage.setItem('documentTitle', fileName.value);
};

content.addEventListener('mouseenter', function () {
    const a = content.querySelectorAll('a');
    a.forEach(item => {
        item.addEventListener('mouseenter', function () {
            content.setAttribute('contenteditable', false);
            item.target = '_blank';
        });
        item.addEventListener('mouseleave', function () {
            content.setAttribute('contenteditable', true);
        });
    });
});

const showCode = document.getElementById('show-code');
let active = false;

showCode.addEventListener('click', function () {
    showCode.dataset.active = !active;
    active = !active;
    if (active) {
        content.textContent = content.innerHTML;
        content.setAttribute('contenteditable', false);
    } else {
        content.innerHTML = content.textContent;
        content.setAttribute('contenteditable', true);
    }
});

function fileHandler(value) {
    if (value === 'new') {
        content.innerHTML = '';
        fileName.value = "Nuevo Documento";
        localStorage.removeItem('documentContent'); // Eliminar contenido guardado
        localStorage.removeItem('documentTitle'); // Eliminar título guardado
    } else if (value === 'txt') {
        const blob = new Blob([content.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName.value}.txt`;
        link.click();
    } else if (value === 'pdf') {
        html2pdf().from(content).save(fileName.value);
    }
}
