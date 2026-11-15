document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
        name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
        email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
        phone: { input: document.getElementById('phone'), error: document.getElementById('phoneError') },
        message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
    };
    const success = document.getElementById('successBanner');

    function setError(field, text) {
        field.error.textContent = text;
        field.input.setAttribute('aria-invalid', text ? 'true' : 'false');
    }
    function validate() {
        let valid = true;
        const name = fields.name.input.value.trim();
        const email = fields.email.input.value.trim();
        const phone = fields.phone.input.value.trim();
        const message = fields.message.input.value.trim();

        setError(fields.name, name ? '' : 'Please enter your name.');
        setError(fields.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email address.');
        setError(fields.phone, !phone || /^\d+$/.test(phone) ? '' : 'Use digits only for the phone number.');
        setError(fields.message, message ? '' : 'Please enter a message.');
        Object.values(fields).forEach((field) => {
            if (field.error.textContent) valid = false;
        });
        return valid;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (success) success.hidden = true;
        if (!validate()) {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        if (success) {
            success.textContent = 'Your message passed validation. It has not been sent because this site does not yet have a message-delivery service.';
            success.hidden = false;
        }
    });

    Object.values(fields).forEach(({ input, error }) => {
        input.addEventListener('input', () => {
            if (error.textContent) validate();
        });
    });
});
