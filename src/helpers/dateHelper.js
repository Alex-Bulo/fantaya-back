const moment = require('moment');


const sortByDateAscending = (date1, date2) => moment(date1).diff(moment(date2));


const getNumberOfDays = (from, to) => {
    const startDate = moment(from)
    const endDate = moment(to)  
    
    
    return moment.duration(endDate.diff(startDate)).asDays()
}

const getNextDay = (from = moment()) => {
    const nextDay = from.add(1,'day')

    return nextDay.format('YYYY-MM-DD')
}

const getPrevDay = (from = moment()) => {
    const prevDay = from.subtract(1,'day')

    return prevDay.format('YYYY-MM-DD')
}


const getLastMonth = ( from = moment() ) => {
    const lastMonth = from.subtract(1,'month')
    
    return lastMonth.format('YYYY-MM-DD')
}

const getNextMonth = ( from = moment() ) => {
    const nextMonth = from.add(1,'month')
    
    return nextMonth.format('YYYY-MM-DD')
}

const getLastFortnight = () => {
    const nextFortnight = moment().date() - 15
    
    return moment().dates(nextFortnight).format('YYYY-MM-DD')
}

const getNextFortnight = () => {
    const nextFortnight = moment().date() + 15
    
    return moment().dates(nextFortnight).format('YYYY-MM-DD')
}

const getAllDays = (start, end) => {
    const from = moment(start).format('YYYY-MM-DD')
    const to = moment(end).format('YYYY-MM-DD')

    const days = []

    for (let day = from; moment(day).isSameOrBefore(to,'day') ;) {
        days.push(day)
        day = moment(day).date(moment(day).date()+1).format('YYYY-MM-DD')    
            
    }
    
    return days
}

const getAllMonth = (month, accountDate=false) => {
    let from = moment(month).startOf('month').format('YYYY-MM-DD')
    const to = moment(month).endOf('month').format('YYYY-MM-DD')
    const today = moment().format('YYYY-MM-DD')
    
    if(accountDate && moment(today).isAfter(from)){
        from = today
    }

    return getAllDays(from,to)
    
}

const isAfter = (from, to) =>{
    const startDate = moment(from)
    const endDate = moment(to)  

    return moment(endDate).isAfter(startDate)
}

const isDate = (dateToCheck) => {
    return moment(dateToCheck).isValid()
}

const getProxAvail = (bookings, from, to) =>{
    const startDate = moment(from)

    const duration = getNumberOfDays(from,to)

    const daysInMonths = [
        ...getAllMonth(startDate,true), 
        ...getAllMonth(startDate.month(startDate.month()+1).format('YYYY-MM-DD'))
    ]

    const daysBookedRaw = bookings.map(booking => getAllDays( booking.startDate, moment(booking.endDate).date(moment(booking.endDate).date()-1).format('YYYY-MM-DD')) )
    const daysBooked = [].concat(...daysBookedRaw)

    const daysAvail = daysInMonths.filter(day => daysBooked.indexOf(day)=== -1)

    const proxStartDate = daysAvail[0]
    const proxEndDate = daysAvail.filter(day => moment(proxStartDate).diff(day,'day') >= duration*-1)
    
    return {
        startDate: proxStartDate, 
        endDate: proxEndDate[proxEndDate.length-1]
      }

}

const isBooked = (bookings, from, to) => {
    const startDate = moment(from)
    const endDate = moment(to)
    
    return  bookings.some(booking => {
        const bookIn = moment(booking.startDate)
        const bookOut = booking.endDate ? moment(booking.endDate) : moment('2500-12-30')
        
        if( bookIn.isBetween(startDate,endDate,undefined,'[)') ||
            bookOut.isBetween(startDate,endDate,undefined,'(]') ){
                
            return true
        
        }else if (startDate.isBetween(bookIn,bookOut,undefined,'[)') ||
                    endDate.isBetween(bookIn,bookOut,undefined,'(]') ){
        
            return true 
        
        }else{
          return false
        }
  
    })

  }

const getYMDFormat = (date)=>{
    const dateToFormat = new Date(date);
    const year = dateToFormat.getFullYear();
    const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
    const day = String(dateToFormat.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
module.exports = {
    sortByDateAscending,
    getNumberOfDays, getAllDays,
    getNextDay, getPrevDay, getLastMonth, getNextMonth, getLastFortnight, getNextFortnight, 
    isAfter, isDate, isBooked,
    getProxAvail,
    getYMDFormat
}