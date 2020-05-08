/*
  Formats various things.
  Only modules used a lot should be here.
*/

module.exports = {
  // Tags a member by user#disc; replaces emojis if needed
  tag: (user, emojifilter = true) => {
    if (user && emojifilter) {
      return `${/[,.\-_a-zA-Z0-9]{1,32}/.exec(user.username) !== null ? /[,.\-_a-zA-Z0-9]{1,32}/.exec(user.username)[0] : user.id}#${user.discriminator}`;
    } else if (user && !emojifilter) {
      return `${user.username}#${user.discriminator}`;
    }
    return;
  },

  // Makes dates look nicer
  date: (EpochDate, syear = true) => {
    const date = new Date(EpochDate);
    // Sets the month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    let day = date.getDate();
    // Sets the dates
    if (day === 1 || day === 21 || day === 31) day = `${date.getDate()}st`;
    else if (day === 2 || day === 22 || day === 32) day = `${date.getDate()}nd`;
    else if (day === 3 || day === 23 || day === 32) day = `${date.getDate()}rd`;
    else day = `${date.getDate()}th`;
    const year = date.getFullYear();
    // Gets the date & formats it
    const time = `${(date.getHours() < 10 ? "0" : "") + date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}`;
    // Returns the formatted date/time
    return `${month} ${day}${syear ? ` ${year} ` : " "}${time}`;
  },

  // Formats dates
  dateParse: (time, options = {
    hours: true,
    days: true,
    months: true,
    years: true,
    autohide: true,
  }) => {
    // Sets constants for date parsing
    if (!time) return;
    let finalstring = "";
    let hour;
    let day;
    let month;
    let year;
    // Parses hours
    if (options.hours) {
      hour = time / 3600;
      if (options.autohide) finalstring = `${hour.toFixed(1)} hours`;
      if (!options.autohide) finalstring += `${hour.toFixed(1)} hours `;
    }

    // Parses days
    if (options.days) {
      day = time / 86400;
      if (hour > 24 && options.autohide) finalstring = `${day.toFixed(1)} days`;
      if (!options.autohide) finalstring += `${day.toFixed(0)} days `;
    }

    // Parses months
    if (options.months) {
      month = time / 2592000;
      if (day > 31 && options.autohide) finalstring = `${month.toFixed(1)} months`;
      if (!options.autohide) finalstring += `${month.toFixed(0)} months `;
    }

    // Parses years
    if (options.years) {
      year = time / 32140800;
      if (month > 12 && options.autohide) finalstring = `${year.toFixed(2)} years`;
      if (!options.autohide) finalstring += `${year.toFixed(0)} years`;
    }
    return finalstring;
  },

  // Formats time left in a day
  day: (ms) => {
    let d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s %= 60;
    h = Math.floor(m / 60);
    m %= 60;
    // eslint-disable-next-line prefer-const
    d = Math.floor(h / 24);
    h %= 24;
    h += d * 24;
    return `${h} hours and ${m} minutes`;
  },

  // Formats server regions
  region(region) {
    switch (region) {
      case "amsterdam":
        return ":flag_nl: Amsterdam";
      case "brazil":
        return ":flag_br: Brazil";
      case "eu-central":
        return ":flag_eu: Central Europe";
      case "eu-west":
        return ":flag_eu: Western Europe";
      case "europe":
        return ":flag_eu: Europe";
      case "dubai":
        return ":flag_ae: Dubai";
      case "frankfurt":
        return ":flag_de: Frankfurt";
      case "hongkong":
        return ":flag_hk: Hong Kong";
      case "london":
        return ":flag_gb: London";
      case "japan":
        return ":flag_jp: Japan";
      case "india":
        return ":flag_in: India";
      case "russia":
        return ":flag_ru: Russia";
      case "singapore":
        return ":flag_sg: Singapore";
      case "southafrica":
        return ":flag_za: South Africa";
      case "sydney":
        return ":flag_au: Sydney";
      case "us-central":
        return ":flag_us: US Central";
      case "us-east":
        return ":flag_us: US East";
      case "us-south":
        return ":flag_us: US South";
      case "us-west":
        return ":flag_us: US West";
      default:
        return region;
    }
  },

  // Formats uptime
  uptime: () => {
    const uptime = process.uptime();
    const date = new Date(uptime * 1000);
    const days = date.getUTCDate() - 1,
      hours = date.getUTCHours(),
      minutes = date.getUTCMinutes();
    const segments = [];
    if (days > 0) segments.push(`${days} day${days === 1 ? "" : "s"}`);
    if (hours > 0) segments.push(`${hours} hour${hours === 1 ? "" : "s"}`);
    if (minutes === 0) segments.push("Less than a minute");
    if (minutes > 0) segments.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
    const dateString = segments.join(", ");
    return dateString;
  },
};