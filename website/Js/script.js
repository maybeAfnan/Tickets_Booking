
  const btn = document.getElementById('burgerButton');
  const menu = document.getElementById('navMenu');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  function handleTicketClick(event, url) {
    event.preventDefault();
    //user try to access tickets
     const userEmail = sessionStorage.getItem("userEmail");
     if (!userEmail) {
         alert("Please login or register to book tickets");
     } else {
         window.location.href = url;
    }
}
