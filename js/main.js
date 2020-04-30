/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function () {
    
    /**
     * SETUP
     */

    // Punto di partenza
    var baseMonth = moment('2018-01-01'); 

    // Init Handlebars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    // EVENT LISTENER
    // Buttons refs
    var prevBtn = $('.previous');
    var nextBtn = $('.next');

    //bottone "next"
    nextBtn.click(function() {
        var activeMonth = moment($('h1').attr('data-this-date'));
        var nextMonth = activeMonth.add(1, 'months');

        switch (nextMonth.year() >=2019) {
            case true: // quando supero dicembre 2018 ritorno a gennaio 2018
                $('.month-list').html('');
                printMonth(template, baseMonth);
                printHoliday(baseMonth);
                break;
            default:
                $('.month-list').html('');
                printMonth(template, nextMonth);
                printHoliday(nextMonth);
        }
    });

    //bottone "previous"
    prevBtn.click(function() {
        var activeMonth = moment($('h1').attr('data-this-date'));
        var prevMonth = activeMonth.subtract(1, 'months');

        switch (prevMonth.year() <=2017) {
            case true: // quando supero gennaio 2018 ritorno a dicembre 2018
                prevMonth = activeMonth.add(12, 'months');
                $('.month-list').html('');
                printMonth(template, prevMonth);
                printHoliday(prevMonth);
                break;
            default:
                $('.month-list').html('');
                printMonth(template, prevMonth);
                printHoliday(prevMonth);
        }
    });


}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $('h1').html( date.format('MMMM YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD MMMM'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('holiday');
                    listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });
}