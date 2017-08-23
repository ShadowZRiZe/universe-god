function template(Generator) {
  return `
  <div id="${Generator.elementID}" class="accordion-button noselect">
    <div class="ui grid grid-accordion">
      <div class="two wide column pause">
        <div>
          <i id="${Generator.pauseID}" class="pause icon accordion-icon"></i>
        </div>
      </div>
      <div class="one wide column sell">
        <div>
          <i id="${Generator.sellID}" class="dollar icon accordion-icon"></i>
        </div>
      </div>
      <div class="one wide column upgrade">
        <div>
          <i id="${Generator.upgradeID}" class="angle double up icon accordion-icon"></i>
        </div>
      </div>
      <div class="one wide column success">
        <div>
          <i id="${Generator.successID}" class="trophy icon accordion-icon"></i>
        </div>
      </div>
      <div class="eleven wide column buy">
        <p id="${Generator.statsID}"></p>
      </div>
    </div>

    <div class="bar">
      <div id="${Generator.barID}" class="filler"></div>
    </div>
  </div>`;
}

export { template };
