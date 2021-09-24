export interface DropDownItemInfo {
    id: string,
    text: string
}

interface DropDownInfo {
    variableName: string,
    dropDownList: DropDownItemInfo[]
}

function createCurrentElement(dropdownInfo: DropDownInfo):HTMLElement {
    const dropdownCurrent = document.createElement("div");
    dropdownCurrent.classList.add("select-box__current");

    dropdownInfo.dropDownList.forEach((dropdownItemInfo: DropDownItemInfo, index) => {
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("select-box__value");

        const input = document.createElement("input");
        input.classList.add("select-box__input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", dropdownItemInfo.id);
        input.setAttribute("value", dropdownItemInfo.text);
        input.setAttribute("name", dropdownInfo.variableName);
        if (index === 0) {
            input.setAttribute("checked", "checked");
        }

        dropdownItem.appendChild(input);

        const text = document.createElement("p");
        text.classList.add("select-box__input-text");
        text.innerText = dropdownItemInfo.text;

        dropdownItem.appendChild(text);

        dropdownCurrent.appendChild(dropdownItem);
    });

    const arrow = document.createElement("img");
    if (dropdownInfo.variableName === 'character') {
        arrow.setAttribute("src", "./img/desktop-window/dropdown-arrow.svg");
    } else {
        arrow.setAttribute("src", "./img/in-game-window/dropdown/drop-down-arrow.png");
    }
    arrow.setAttribute("alt", "Arrow Icon");
    arrow.classList.add("select-box__icon");

    dropdownCurrent.appendChild(arrow)

    return dropdownCurrent;
}

function createListElement(dropdownInfo: DropDownInfo):HTMLElement {
    const dropdownList = document.createElement("ul");
    dropdownList.classList.add("select-box__list");

    dropdownInfo.dropDownList.forEach((dropdownItemInfo: DropDownItemInfo) => {
        const li = document.createElement("li");

        const label = document.createElement("label");
        label.classList.add("select-box__option");
        label.setAttribute("for", dropdownItemInfo.id);
        label.innerText = dropdownItemInfo.text;

        li.appendChild(label);

        dropdownList.appendChild(li);
    });
    
    return dropdownList;
}

export function createCustomDropDown(dropdownInfo: DropDownInfo):HTMLElement {
    const dropdown = document.createElement("div");
    dropdown.classList.add("select-box");
    dropdown.setAttribute("tabindex", "1");

    const current = createCurrentElement(dropdownInfo);
    // if (dropdownInfo.variableName === 'raid_dungeon') {
    //     current.classList.add('focussed');
    // }
    dropdown.appendChild(current);

    const list = createListElement(dropdownInfo);
    dropdown.appendChild(list);

    current.addEventListener('click', (e) => {
        current.classList.toggle('focussed');
    });

    dropdown.addEventListener('blur', (e) => {
        e.stopPropagation();
        current.classList.remove('focussed');
    });

    return dropdown;
}
