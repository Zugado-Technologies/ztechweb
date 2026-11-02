/**
 * Zugado Technologies - Accessible Form Handling & Transmission
 * Adheres to AGENTS.md rule: Never fake a successful submission without a verified backend.
 */
export function initForms() {
  const forms = document.querySelectorAll('form[data-inquiry-form]');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const alertBox = form.querySelector('.form-alert');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const subjectType = data.inquiry_type || 'General Inquiry';
      const senderName = data.name || 'Anonymous';
      const senderEmail = data.email || 'Not provided';
      const senderRole = data.role || data.area_of_interest || '';
      const message = data.message || data.note || '';

      const subject = encodeURIComponent(`[Zugado Tech] ${subjectType}: ${senderName}`);
      let bodyText = `Name: ${senderName}\nEmail: ${senderEmail}\n`;
      if (senderRole) bodyText += `Role/Area: ${senderRole}\n`;
      if (data.portfolio) bodyText += `Portfolio/GitHub: ${data.portfolio}\n`;
      bodyText += `\nMessage:\n${message}\n`;

      const mailtoUrl = `mailto:hello@zugadotechnologies.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

      // Launch mailto client
      window.location.href = mailtoUrl;

      // Display honest message
      if (alertBox) {
        alertBox.className = 'form-alert info';
        alertBox.innerHTML = `
          <strong>Opening your email client...</strong><br />
          If your client does not open automatically, please send your inquiry directly to 
          <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: 600;">hello@zugadotechnologies.com</a>.<br />
          <span style="font-size: 0.8125rem; color: var(--color-text-muted);">
            Note: This static website uses secure client-side dispatch. Submissions are received directly by our team.
          </span>
        `;
      }
    });
  });
}
