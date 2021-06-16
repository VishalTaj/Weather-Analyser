window.teleport = {
  city: {
    slug: 'kuala-lumpur',
    title: 'Kuala Lumpur'
  },
};
var tabCounter = 0;

function slugify(title) {
  return title.toLowerCase()
  .replace(/ /g,'-')
  .replace(/[^\w-]+/g,'')
}

function tabGenerator() {
  var template = document.querySelector('#tiles-template');
  document.querySelector('#tab-content').appendChild(template.content.cloneNode(true));
  template = document.querySelector('#tab-list-template');
  document.querySelector('#tab-list').appendChild(template.content.cloneNode(true));
}

function loaderSwitch(action) {
  action == 0 ? $('#loader-wrapper').css('display', 'none') : $('#loader-wrapper').css('display', 'flex');
}


function locationGet(){
  //Detect the users location and parse the city and state
  $.get("http://ipinfo.io", function (response) {
      $newCity = $('#location-select option[value="'+slugify(response.city)+'"]');
      if($newCity.length > 1) {
        $('#location-select').val($newCity.val());
      } else {
        $('#location-select').val(teleport.city.slug);
      }
      $('#location-select').change();
      requestData();
      loaderSwitch(0);
  }, "jsonp");
}

function injectData(data) {
  tabGenerator();
  visibility = Math.round(data.visibility *0.000621371192);
  sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US");
  sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US");
  

  $('#tab-content .tab-pane:last-child').attr('id', 'tab' + tabCounter);
  $('#tab-list li:last-child a').attr('href', '#tab' + tabCounter);
  $activeTab = $('#tab' + tabCounter);


  
  //Temp
  $activeTab.find(".temp").html( '<p class="tempNum">' + data.main.temp + '°</p>');
  $activeTab.find(".htemp span").text(data.main.temp_max + '°');
  $activeTab.find(".ltemp span").text(data.main.temp_min + '°');
  //wind
  $activeTab.find('.wind').html('<p class="humidPercent"> '+data.wind.speed+ '</p><p class="vis">mph</p>');
  //humidity
  $activeTab.find(".humid").html('<p class="humidPercent">' + data.main.humidity + '</p><p class="vis"> Relative Humidity</p>');
  //pressure
  $activeTab.find(".presTrend").html( '<p class="humidPercent">' + data.main.pressure + ' </p><p class="vis">  hPa </p>');
  //visibility
  $activeTab.find(".visability").html('<p class="visNum">' + visibility + '</p>' + '<p class="vis">Miles Visibility</p>');
  $activeTab.find('.rise').text(sunrise);
  $activeTab.find('.set').text(sunset);
  if (data.weather.length > 0) {
    $activeTab.find('.weather-condition').html('<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" />' + data.weather[0].main + '(' + data.weather[0].description + ')');
  }

  $('.forecast-view-wrapper a').attr('href', '/forecast/'+ $('#location-select option:selected').val());
  $('#tab-content .tab-pane').removeClass('show active');
  $('#tab-content .tab-pane:last-child').addClass('show active');
  $('#tab-list li a').removeClass('show active');
  $('#tab-list li:last-child a').addClass('show active');
  $('#tab-list li:last-child a .tab-title').text($('#location-select option:selected').text());
  
}

function requestData() {
  $activeCity = $('#location-select option:selected').text();
  tabExist = $('.tab-title').filter(function() {return $(this).text() == $activeCity }).length > 0;
  if (tabCounter < 3 && !tabExist) {
    ++tabCounter;
    $.ajax({
      url: '/check_by_location/',
      method: 'GET',
      data: {city: $('#location-select option:selected').val()},
      dataType: 'json',
      success: function(data) {
        injectData(data);
        loaderSwitch(0);
      },
      error: function(data) {
      }
    });
  } else {
    alert('Error: Duplicate selection or maximum tab reached.');
    loaderSwitch(0);
  }
}

$(document).ready(function() {
  var today = new Date();

  $('#today').text('Today: '+ today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
  $('#get-weather-btn').on('click', function() {
    loaderSwitch(1);
    requestData();
  });

  if (location.pathname === '/')
    locationGet();

  $('body').on('click', '.nav-link i', function(){
    selector = $(this).parent().attr('href');
    $(selector).remove();
    $(this).parents().eq(1).remove();
    $('#tab-list li:first-child a').click();
    tabCounter--;
  })
})
