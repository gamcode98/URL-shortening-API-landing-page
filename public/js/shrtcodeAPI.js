export default function shortUrl() {
  const d = document;
  const ls = localStorage;
  const $template = d.getElementById("link-shorterned-template").content;
  const $longUrl = d.getElementById("long-url");
  const $btnUrl = d.getElementById("btn-url");
  const $paintedLinks = d.getElementById("painted-links");
  const $modal = d.querySelector("dialog");

  let shortsLinks = [];

  const addShortsLinks = (originalLink, fullShortLink3) => {
    const objectShortsLinks = {
      original_link: originalLink,
      full_short_link_3: fullShortLink3,
      id_copy_btn: `${crypto.randomUUID()}`,
      id_delete_btn: `${crypto.randomUUID()}`,
    };
    shortsLinks.push(objectShortsLinks);
  };

  const getShortUl = async (origin) => {
    try {
      let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${origin}`);
      let json = await res.json();
      if (!res.ok) throw { status: res.status, statusText: res.statusText };
      addShortsLinks(json.result.original_link, json.result.full_short_link3);
    } catch (error) {
      let message =
        `${error.statusText}` ||
        `Something went wrong with API. Error: ${error.status}`;
      const $pError = d.createElement("p");
      $pError.classList.add("wrapper", "errorAPI");
      $pError.textContent = message;
      $paintedLinks.appendChild($pError);
    }
  };
  //Insert html content
  const addTemplateShorternedLink = () => {
    ls.setItem("shorterned_links", JSON.stringify(shortsLinks));
    $paintedLinks.textContent = "";
    const $fragment = d.createDocumentFragment();

    shortsLinks.forEach((el) => {
      const $clone = $template.cloneNode(true);

      $clone.querySelector(".link-original").textContent = el.original_link;
      $clone.querySelector(".link-shorterned p").textContent =
        el.full_short_link_3;
      $clone.querySelector(".btn-copy").dataset.id = el.id_copy_btn;
      $clone.querySelector(".btn-delete").dataset.id = el.id_delete_btn;

      $fragment.appendChild($clone);
    });
    $paintedLinks.appendChild($fragment);
  };

  const $p = d.createElement("p");
  $p.textContent = "Please add a link with http:// or https://";
  $p.classList.add("error", "none");
  $longUrl.insertAdjacentElement("afterend", $p);
  let validated = false;

  //Validation listener
  $longUrl.addEventListener("keyup", () => {
    let pattern = /^h{1}t{2}ps?:{1}\/{2}\w+\.\w+/;
    let regex = new RegExp(pattern);

    !regex.exec($longUrl.value)
      ? ($p.classList.remove("none"), (validated = false))
      : ($p.classList.add("none"), (validated = true));
  });

  //Add link
  $btnUrl.addEventListener("click", (e) => {
    e.preventDefault();
    if ($longUrl.value === "") {
      $p.classList.remove("none");
    } else {
      if (validated) {
        $p.classList.add("none");
        getShortUl($longUrl.value);
        $modal.showModal();
        setTimeout(() => {
          addTemplateShorternedLink();
          $modal.close();
        }, 3000);
        $longUrl.value = "";
      }
    }
  });

  //Copy clipboard and remove link

  d.addEventListener("click", (e) => {
    if (e.target.matches(".btn-copy")) {
      let linkCopy = shortsLinks.filter(
        (el) => el.id_copy_btn === e.target.dataset.id
      );
      let url = linkCopy[0].full_short_link_3;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          e.target.classList.add("isActive");
          e.target.textContent = "Copied!";
          setTimeout(() => {
            e.target.classList.remove("isActive");
            e.target.textContent = "Copy";
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          e.target.textContent = "Error!";
        });
    }

    if (e.target.matches(".btn-delete")) {
      shortsLinks = shortsLinks.filter(
        (el) => el.id_delete_btn !== e.target.dataset.id
      );
      addTemplateShorternedLink();
    }
  });

  d.addEventListener("DOMContentLoaded", () => {
    if (ls.getItem("shorterned_links")) {
      shortsLinks = JSON.parse(ls.getItem("shorterned_links"));
      addTemplateShorternedLink();
    }
  });
}
