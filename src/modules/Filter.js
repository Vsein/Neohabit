import all from '../icons/square-small.svg';
import today from '../icons/calendar-today-outline.svg';
import thisWeek from '../icons/calendar-week-outline.svg';
import important from '../icons/star.svg';

const defaultCategoryPictures = {
  All: all,
  Today: today,
  'This Week': thisWeek,
  Important: important,
};

export default class Filter {
  constructor(name, image = '') {
    this.name = name;
    if (!image && name in defaultCategoryPictures) {
      this.image = defaultCategoryPictures[name];
    }
  }
}
