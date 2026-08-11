const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzEeaTF4b_DybmnJ05VmIspDi3EcJDA1Ft2on5QecKB-xzULzWmYifPXiRKHh6hgD5f0A/exec';

const form = document.querySelector('#rsvpForm');
const phone = document.querySelector('#whatsapp');
const status = document.querySelector('#status');
const submitButton = form?.querySelector('button[type="submit"]');

if (phone) {
  phone.addEventListener('input', () => {
    const n = phone.value.replace(/\D/g, '').slice(0, 11);
    phone.value = n
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form));

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Enviando... 💕';
    }

    if (status) {
      status.textContent = 'Registrando sua resposta... 💕';
      status.className = '';
    }

    // Mantém uma cópia local como segurança, sem substituir o envio para a planilha.
    try {
      const saved = JSON.parse(localStorage.getItem('arielzinha-confirmacoes') || '[]');
      saved.push({ ...data, enviadoEm: new Date().toISOString() });
      localStorage.setItem('arielzinha-confirmacoes', JSON.stringify(saved));
    } catch (_) {
      // O envio para a planilha continua mesmo se o localStorage estiver indisponível.
    }

    // Usamos application/x-www-form-urlencoded + no-cors para evitar preflight/CORS
    // no Google Apps Script. O Apps Script recebe os campos em e.parameter.
    const payload = new URLSearchParams({
      nome: data.nome || '',
      adultos: data.adultos || '0',
      criancas: data.criancas || '0',
      whatsapp: data.whatsapp || '',
      presenca: data.presenca || '',
      mensagem: data.mensagem || ''
    });

    try {
      await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: payload.toString()
      });

      if (status) {
        status.textContent = data.presenca === 'sim'
          ? `Que alegria, ${data.nome}! Presença confirmada. 💕`
          : `Obrigada por avisar, ${data.nome}. 💕`;
        status.className = 'success';
      }

      form.reset();
      form.adultos.value = 1;
      form.criancas.value = 0;

    } catch (error) {
      console.error('Erro ao enviar RSVP:', error);

      if (status) {
        status.textContent = 'Não conseguimos enviar agora. Verifique sua conexão e tente novamente. 💕';
        status.className = 'error';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || '🐚  Confirmar Presença';
      }
    }
  });
}

// Bolhas decorativas
const bubbles = document.createElement('div');
bubbles.className = 'bubbles';
bubbles.setAttribute('aria-hidden', 'true');
bubbles.innerHTML = Array.from({ length: 20 }, (_, i) =>
  `<span style="--x:${(i * 17 + 3) % 96}%;--s:${10 + (i * 7) % 27}px;--d:${8 + (i % 6) * 2}s;--delay:-${i % 9}s"></span>`
).join('');
document.body.prepend(bubbles);
