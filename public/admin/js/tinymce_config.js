const textareas = document.querySelectorAll("[textarea-mce]");
if (textareas.length > 0) {
    tinymce.init({
        selector: '[textarea-mce]',
        plugins: 'advlist autolink lists link image charmap preview anchor pagebreak',
        toolbarMode: 'floating',
        toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        height: 400
    });
}