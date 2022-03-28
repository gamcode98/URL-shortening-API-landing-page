export default function shortUrl() {
  const d = document;
  const $template = d.getElementById("link-shorterned-template").content;
  const $longUrl = d.getElementById("long-url");
  const $btnUrl = d.getElementById("btn-url");
  const $shortenerForm = d.querySelector(".shortener-form");
  const ls = localStorage;
  let $shorternedLinks;
  const abcdario = "abcdefghlijklmnopqrstuvwyz";
  const abcdarioArray = [...abcdario];
  const emptyArray = [];
  let btnCopyExsist = false;

  const returningContent = () => {
    const $btnCopy = d.querySelectorAll(".btn-copy");
    $shorternedLinks = d.querySelectorAll(".link-shorterned p");
    let i = 0;

    // $shorternedLinks.forEach((el) => {
    //   console.log(i, abcdarioArray[i]);
    //   // ls.setItem(`${el.textContent}`, el.textContent)
    //   ls.setItem(`${abcdarioArray[i]}`, el.textContent);
    //   i++;
    // });

    $shorternedLinks.forEach((el) => {
      emptyArray.push(el.textContent);
      console.log(emptyArray);
    });

    // $shorternedLinks.forEach((el) => {
    //   ls.getItem(`${el.textContent}`);
    //   console.log(ls.getItem(`${el.textContent}`));
    // });

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
      // console.log(json);
      addTemplateInIndexHTML(
        json.result.original_link,
        json.result.full_short_link3
      );
    } catch (error) {
      let message = error.statusText || "Something went wrong";
      // $fetchAsync.innerHTML = `Error ${err.status}: ${message}`;
      // console.log(message);
      // console.log(error.status);
    }
  };

  const $p = d.createElement("p");
  $p.textContent = "Please add a link with http:// or https://";
  $p.classList.add("error", "none");
  $longUrl.insertAdjacentElement("afterend", $p);
  let validated = false;

  $longUrl.addEventListener("keyup", () => {
    let pattern = /^h{1}t{2}ps?:{1}\/{2}\w+\.\w+/;
    let regex = new RegExp(pattern);

    !regex.exec($longUrl.value)
      ? ($p.classList.remove("none"), (validated = false))
      : ($p.classList.add("none"), (validated = true));
  });

  $btnUrl.addEventListener("click", (e) => {
    e.preventDefault();
    if ($longUrl.value === "") {
      $p.classList.remove("none");
    } else {
      if (validated) {
        $p.classList.add("none");
        getShortUl($longUrl.value);
      }
    }
  });

  console.log(emptyArray);

  emptyArray.forEach((el) => console.log(el));

  d.addEventListener("DOMContentLoaded", () => {
    // for (let index = 0; index < 20; index++) {
    //   console.log(ls);
    // }
    // console.log($shorternedLinks);
    // console.log("hii");
    emptyArray.forEach((el) => console.log(el));
    // $shorternedLinks.forEach((el) => console.log(el.textContent));
  });
}
