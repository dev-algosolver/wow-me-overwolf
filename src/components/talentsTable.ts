interface TalentItem {
    name: string,
    icon: string,
    count: number,
    percent: number,
    is_selected: boolean
}

interface TalentLevel {
    level: number,
    talentItemList: TalentItem[],
    is_selected: boolean
}

interface TalentTable {
    talentLevelList: TalentLevel[]
}

const getColorForPercentage = function(pct: number) {
    const pctUpper = (pct < 50 ? pct : pct - 50) / 50;
    const pctLower = 1 - pctUpper;
    const r = Math.floor(222 * pctLower + (pct < 50 ? 222 : 0) * pctUpper);
    const g = Math.floor((pct < 50 ? 0 : 222) * pctLower + 222 * pctUpper);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | 0x00).toString(16).slice(1);
}

function createTalentRowElement(talentLevel: TalentLevel, treeMode: boolean):HTMLElement {
    const talentLevelElement = document.createElement("div");
    talentLevelElement.classList.add("talent-row");
    talentLevelElement.setAttribute("data-selected", talentLevel.is_selected ? "yes" : "no");

    const level = document.createElement("div");
    level.classList.add("outer");

    const levelInner = document.createElement("div");
    levelInner.classList.add("inner");
    levelInner.innerText = `${talentLevel.level}`;

    level.appendChild(levelInner);
    
    talentLevelElement.appendChild(level);

    talentLevel.talentItemList.forEach(talentItem => {
        const talentItemElement = document.createElement("div");
        talentItemElement.classList.add("outer");
        talentItemElement.setAttribute("data-selected", talentItem.is_selected ? "yes" : "no");
    
        const Inner = document.createElement("div");
        Inner.classList.add("inner");

        if (!treeMode) {
            const percent = document.createElement("span");
            percent.classList.add('percent');
            percent.style['color'] = getColorForPercentage(talentItem.percent);
            percent.innerText = `${talentItem.percent}`;
            Inner.appendChild(percent);
        }

        const icon = document.createElement("i");
        icon.classList.add("talent-icon");
        icon.style.backgroundImage = `url(/img/in-game-window/talents/${talentItem.icon})`;

        const text = document.createElement("span");
        text.innerText = talentItem.name;

        Inner.appendChild(icon);
        Inner.appendChild(text);
        
        talentItemElement.appendChild(Inner);
        talentLevelElement.appendChild(talentItemElement);
    });

    return talentLevelElement;
}

export function createTalentsTable(talentTable: TalentTable, treeMode: boolean):HTMLElement {
    const talentsTableElement = document.createElement("div");
    talentsTableElement.classList.add("talent-table");

    talentTable.talentLevelList.forEach(talentLevel => {
        const talentLevelElement = createTalentRowElement(talentLevel, treeMode);
        talentsTableElement.appendChild(talentLevelElement);
    });

    return talentsTableElement;
}