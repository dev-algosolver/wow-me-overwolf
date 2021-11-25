import { createCustomDropDown } from "../components/dropdown";

const convertCharactersToDropdownFormat = (characters) => {
  const result = [];
  for (const character of characters) {
    result.push({
      id: character.id,
      text: `${character.realm_name} - ${character.name}`,
    });
  }

  return result;
};

export default class CharacterInfo {
  private characters = [];
  private selectedCharacterID;

  constructor(characters) {
    this.characters = characters;
  }

  private setElementInnerHTML(id, content) {
    const el = document.getElementById(id);
    el.innerHTML = content;
  }

  private initDropDownEventListner(name: string) {
    document.getElementsByName(name).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        this.selectedCharacterID = (<HTMLInputElement>e.target).getAttribute(
          "id"
        );
        console.log(this.selectedCharacterID);
        this.setCharacterInfoPanel();
      });
    });
  }

  private setCharacterInfoPanel() {
    for (const character of this.characters) {
      if (character.id == this.selectedCharacterID) {
        this.setElementInnerHTML(
          "total_number_deaths",
          `Total Number Deaths: ${character.total_number_deaths}`
        );
        this.setElementInnerHTML(
          "total_gold_gained",
          `Total Gold Gained: ${character.total_gold_gained}`
        );
        this.setElementInnerHTML(
          "total_gold_lost",
          `Total Gold Lost: ${character.total_gold_lost}`
        );
        this.setElementInnerHTML(
          "total_item_value_gained",
          `Total Item Value Gained: ${character.total_item_value_gained}`
        );
        // Changed here as clients given dist file [start]
        // this.setElementInnerHTML("level_number_deaths", `Level Number Deaths: ${character.level_number_deaths}`);
        // this.setElementInnerHTML("level_gold_gained", `Level Gold Gained: ${character.level_gold_gained}`);
        // this.setElementInnerHTML("level_gold_lost", `Level Gold Lost: ${character.level_gold_lost}`);
        // this.setElementInnerHTML("level_item_value_gained", `Level Item Value Gained: ${character.level_item_value_gained}`);
        break;
      }
    }
  }

  public initDropdown() {
    const container = document.getElementById(
      "character-select-box__container"
    );
    container.innerHTML = "";

    const elDropdown = createCustomDropDown({
      variableName: "character",
      dropDownList: convertCharactersToDropdownFormat(this.characters),
    });
    container.appendChild(elDropdown);

    this.initDropDownEventListner("character");

    this.selectedCharacterID =
      this.characters.length > 0 ? this.characters[0].id : null;
    this.setCharacterInfoPanel();
  }
}
