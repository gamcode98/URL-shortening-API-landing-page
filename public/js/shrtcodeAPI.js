export default function shortUrl() {
  const d = document;
  const $template = d.getElementById("link-shorterned-template").content;
  const $longUrl = d.getElementById("long-url");
  const $btnUrl = d.getElementById("btn-url");
  const $shortenerForm = d.querySelector(".shortener-form");
  let btnCopyExsist = false;

  const returningContent = () => {
    const $btnCopy = d.querySelectorAll(".btn-copy");

    $btnCopy.forEach((btn) => {
      btn.addEventListener("click", () => {
        navigator.clipboard
          .writeText(btn.previousElementSibling.textContent)
          .then(() => {
            console.log("Text copied to clipboard...");
          })
          .catch((err) => {
            console.log("something went wrong", err);
          });

        btn.textContent = "Copied!";
        btn.classList.add("isActive");

        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("isActive");
        }, 1000);
      });
    });
  };

  const insertAfter = (e, i) => {
    if (e.nextSibling) {
      e.parentNode.insertBefore(i, e.nextSibling);
    } else {
      e.parentNode.appendChild(i);
    }
  };

  const addTemplateInIndexHTML = (originalLink, fullShortLink3) => {
    $template.querySelector(".link-original").textContent = originalLink;
    $template.querySelector(".link-shorterned p").textContent = fullShortLink3;
    let $clone = document.importNode($template, true);
    insertAfter($shortenerForm, $clone);
    btnCopyExsist ? (btnCopyExsist = true) : returningContent();
  };

  const getShortUl = async (origin) => {
    try {
      let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${origin}`);
      let json = await res.json();
      if (!res.ok) throw { status: res.status, statusText: res.statusText };
      console.log(json);
      addTemplateInIndexHTML(
        json.result.original_link,
        json.result.full_short_link3
      );
    } catch (error) {
      let message = error.statusText || "Something went wrong";
      // $fetchAsync.innerHTML = `Error ${err.status}: ${message}`;
      console.log(message);
      console.log(error.status);
    }
  };

  const validateURL = (origin) => {
    try {
      const url = new URL(origin);
      if (url.origin !== "null") {
        if (url.protocol === "http:" || url.protocol === "https:") {
          return getShortUl(origin);
        }
        throw new Error("tiene que tener https://");
      }
      throw new Error("no válida 😲");
    } catch (error) {
      console.log(error);
      // if (error.message === "Invalid URL") {
      //   req.flash("mensajes", [{ msg: "url no válida" }]);
      // } else {
      //   req.flash("mensajes", [{ msg: error.message }]);
      // }
      // return res.redirect("/");
    }
  };
  $btnUrl.addEventListener("click", (e) => {
    e.preventDefault();
    validateURL($longUrl.value);
  });
}
