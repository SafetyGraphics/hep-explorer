import { dragStarted } from './dragStarted';
import { dragged } from './dragged';
import { dragEnded } from './dragEnded';

// credit to https://bl.ocks.org/dimitardanailov/99950eee511375b97de749b597147d19

export function init() {
    var drag = d3.behavior
        .drag()
        .origin(function(d) {
            return d;
        })
        .on('dragstart', dragStarted)
        .on('drag', dragged)
        .on('dragend', dragEnded);

    this.config.quadrants.wrap.moveToFront();
    this.config.quadrants.cut_g.call(drag);
}
