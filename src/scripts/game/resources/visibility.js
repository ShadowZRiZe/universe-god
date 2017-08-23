import $ from 'jquery';

function visibility(Resource, state) {
  Resource.visible = state;

  if (state) {
    $(`#${Resource.containerID}`).fadeIn('slow');
  }
  else {
    $(`#${Resource.containerID}`).fadeOut('slow');
  }
}

export { visibility };
