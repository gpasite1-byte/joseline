/**
 * Josellene - Website Corporativo
 * Interações, Animações e Lógica de Negócio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualizar ano no rodapé
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Header Scroll Effect & Back-to-Top Button
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollPos > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Mobile Navigation Drawer
  const menuToggle = document.getElementById('menuToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. Smooth Navigation Active Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // 5. Stat Counter Animation
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1500;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(currentVal);
        }
      }, stepTime);
    });
  };

  const heroStats = document.querySelector('.hero-stats-grid');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        runCounters();
      }
    }, { threshold: 0.2 });

    statsObserver.observe(heroStats);
  }

  // 6. Service Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Interactive Proposal Calculator
  const calcCheckboxes = document.querySelectorAll('.calc-service');
  const selectedServicesList = document.getElementById('selectedServicesList');
  const discountBadge = document.getElementById('discountBadge');
  const totalMonthlyEl = document.getElementById('totalMonthly');
  const totalYearlyEl = document.getElementById('totalYearly');
  const btnFinalizarSimulacao = document.getElementById('btnFinalizarSimulacao');
  const btnPreencherContacto = document.getElementById('btnPreencherContacto');

  const formatKz = (amount) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' Kz';
  };

  const updateCalculator = () => {
    const selected = [];
    let monthlyTotal = 0;
    let hasContabilidade = false;
    let hasGestao = false;
    let hasControlo = false;

    calcCheckboxes.forEach(cb => {
      if (cb.checked) {
        const name = cb.value;
        const price = parseFloat(cb.getAttribute('data-price') || '0');
        selected.push({ name, price });

        if (name === 'Contabilidade e Fiscalidade') hasContabilidade = true;
        if (name === 'Gestão Financeira Avançada') hasGestao = true;
        if (name === 'Controlo Interno e Auditoria') hasControlo = true;

        monthlyTotal += price;
      }
    });

    // Check for Pacote Global Integrado: official combo discount
    const hasGlobalPackage = hasContabilidade && hasGestao && hasControlo;
    if (hasGlobalPackage) {
      discountBadge?.classList.add('active');
      // Replace sum of 3 services (1.450.000) with official package price 1.232.500
      const standardFinanceSum = 652500 + 435000 + 362500;
      const packageDiscountedPrice = 1232500;
      monthlyTotal = monthlyTotal - standardFinanceSum + packageDiscountedPrice;
    } else {
      discountBadge?.classList.remove('active');
    }

    const yearlyTotal = monthlyTotal * 12;

    // Render list
    if (selectedServicesList) {
      if (selected.length === 0) {
        selectedServicesList.innerHTML = '<p class="text-muted" style="font-size:0.875rem;">Nenhum serviço selecionado no momento.</p>';
      } else {
        selectedServicesList.innerHTML = selected.map(item => `
          <div class="summary-item">
            <span>• ${item.name}</span>
            <strong>${item.price > 0 ? (hasGlobalPackage && (item.name.includes('Contabilidade') || item.name.includes('Gestão') || item.name.includes('Controlo')) ? 'Pacote' : formatKz(item.price)) : 'Sob Medida'}</strong>
          </div>
        `).join('');
      }
    }

    if (totalMonthlyEl) {
      totalMonthlyEl.textContent = monthlyTotal > 0 ? formatKz(monthlyTotal) : 'Sob Consulta';
    }

    if (totalYearlyEl) {
      totalYearlyEl.textContent = yearlyTotal > 0 ? formatKz(yearlyTotal) : 'Sob Consulta';
    }
  };

  calcCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateCalculator);
  });

  // Run on initial load
  updateCalculator();

  // Button: Send simulation to WhatsApp
  btnFinalizarSimulacao?.addEventListener('click', () => {
    const selected = Array.from(calcCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (selected.length === 0) {
      alert('Por favor, selecione ao menos um serviço no simulador.');
      return;
    }

    const monthlyStr = totalMonthlyEl?.textContent || '';
    const yearlyStr = totalYearlyEl?.textContent || '';

    const text = encodeURIComponent(
      `Olá, equipa Josellene!\n\n` +
      `Gostaria de solicitar uma proposta comercial com base na simulação do site:\n\n` +
      `*Serviços Selecionados:*\n` +
      selected.map(s => `- ${s}`).join('\n') +
      `\n\n*Estimativa Mensal de Referência:* ${monthlyStr}\n` +
      `*Estimativa Anual:* ${yearlyStr}\n\n` +
      `Aguardo o contacto da vossa Direcção Comercial para agendamento de reunião.`
    );

    const waUrl = `https://wa.me/244933237972?text=${text}`;
    window.open(waUrl, '_blank');
  });

  // Button: Populate form from calculator
  btnPreencherContacto?.addEventListener('click', () => {
    const selected = Array.from(calcCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const mensagemInput = document.getElementById('formMensagem');
    if (mensagemInput && selected.length > 0) {
      mensagemInput.value = `Gostaria de uma proposta formal para os seguintes serviços selecionados na simulação:\n- ${selected.join('\n- ')}`;
    }
  });

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const btnSubmitForm = document.getElementById('btnSubmitForm');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('formNome')?.value.trim();
    const email = document.getElementById('formEmail')?.value.trim();
    const telefone = document.getElementById('formTelefone')?.value.trim();
    const assunto = document.getElementById('formAssunto')?.value;
    const mensagem = document.getElementById('formMensagem')?.value.trim();

    if (!nome || !email || !telefone || !mensagem) {
      showFormFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    // Submit visual feedback
    if (btnSubmitForm) {
      btnSubmitForm.disabled = true;
      btnSubmitForm.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando envio...';
    }

    setTimeout(() => {
      showFormFeedback('Mensagem enviada com sucesso! A equipa da Josellene entrará em contacto brevemente.', 'success');
      contactForm.reset();

      if (btnSubmitForm) {
        btnSubmitForm.disabled = false;
        btnSubmitForm.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensagem';
      }

      // Propor envio adicional via WhatsApp
      const redirectWa = confirm(
        'Mensagem registada! Deseja abrir também uma conversa direta no WhatsApp da Josellene para agilizar seu atendimento?'
      );

      if (redirectWa) {
        const msgWa = encodeURIComponent(
          `Olá Josellene, sou ${nome}. Acabei de enviar uma mensagem pelo site a respeito de: "${assunto || 'Serviços'}". Gostaria de dar seguimento!`
        );
        window.open(`https://wa.me/244933237972?text=${msgWa}`, '_blank');
      }
    }, 1200);
  });

  const showFormFeedback = (text, type) => {
    if (!formFeedback) return;
    formFeedback.textContent = text;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';

    setTimeout(() => {
      formFeedback.style.display = 'none';
    }, 6000);
  };
});

/**
 * Função global para preenchimento rápido de assunto a partir dos cartões de serviço
 */
window.preencherAssunto = function(assuntoTexto) {
  const selectAssunto = document.getElementById('formAssunto');
  const mensagemInput = document.getElementById('formMensagem');
  
  if (selectAssunto) {
    // Tenta encontrar opção correspondente ou seleciona a primeira mais próxima
    for (let i = 0; i < selectAssunto.options.length; i++) {
      if (selectAssunto.options[i].text.toLowerCase().includes(assuntoTexto.toLowerCase().replace('interesse em ', '')) ||
          assuntoTexto.toLowerCase().includes(selectAssunto.options[i].text.toLowerCase())) {
        selectAssunto.selectedIndex = i;
        break;
      }
    }
  }

  if (mensagemInput) {
    mensagemInput.value = `Gostaria de mais detalhes e de agendar uma reunião sobre: ${assuntoTexto}.`;
  }
};
