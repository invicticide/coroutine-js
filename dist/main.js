"use strict";
;
(function () {
    let timerElement = document.createElement("p");
    document.body.appendChild(timerElement);
    function log(text) {
        let p = document.createElement("p");
        p.textContent = text;
        document.body.appendChild(p);
        console.log(text);
    }
    let tasks = [waitForSeconds(5)];
    function* waitForSeconds(seconds) {
        log(`Begin waitForSeconds(${seconds})`);
        let waitUntil = window.performance.now() + (seconds * 1000);
        while (window.performance.now() < waitUntil) {
            yield;
        }
        log(`First wait done, now invoking chained wait`);
        yield waitForMilliseconds(seconds * 1000);
        log(`End waitForSeconds`);
    }
    function* waitForMilliseconds(ms) {
        log(`Begin waitForMilliseconds(${ms})`);
        let waitUntil = window.performance.now() + ms;
        while (window.performance.now() < waitUntil) {
            yield;
        }
        log(`End waitForMilliseconds`);
    }
    function update(dt) {
        timerElement.textContent = `dt: ${dt}\nnow: ${window.performance.now()}`;
    }
    let lastMainTime = window.performance.now();
    function main(now) {
        requestAnimationFrame(main);
        let dt = now - lastMainTime;
        update(dt);
        if (tasks.length > 0) {
            let result = tasks[tasks.length - 1].next();
            if (result.done) {
                tasks.pop();
            }
            else if (result.value) {
                tasks.push(result.value);
            }
        }
        lastMainTime = now;
    }
    main(window.performance.now());
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxDQUFDO0FBQUEsQ0FBQztJQUlELElBQUksWUFBWSxHQUFhLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFHeEMsYUFBYSxJQUFhO1FBRXpCLElBQUksQ0FBQyxHQUFhLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDckIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBR0QsSUFBSSxLQUFLLEdBQXNCLENBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFHckQsUUFBUSxDQUFDLGdCQUFnQixPQUFnQjtRQUV4QyxHQUFHLENBQUMsd0JBQXdCLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFFeEMsSUFBSSxTQUFTLEdBQVksTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNyRSxPQUFNLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFO1lBQUUsS0FBSyxDQUFDO1NBQUU7UUFFdEQsR0FBRyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFFbEQsTUFBTSxtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFMUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUdELFFBQVEsQ0FBQyxxQkFBcUIsRUFBVztRQUV4QyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFeEMsSUFBSSxTQUFTLEdBQVksTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDdkQsT0FBTSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsRUFBRTtZQUFFLEtBQUssQ0FBQztTQUFFO1FBRXRELEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFJRCxnQkFBZ0IsRUFBVztRQUUxQixZQUFZLENBQUMsV0FBVyxHQUFHLE9BQU8sRUFBRSxVQUFVLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0lBR0QsSUFBSSxZQUFZLEdBQVksTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNyRCxjQUFjLEdBQVk7UUFHekIscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFHNUIsSUFBSSxFQUFFLEdBQVksR0FBRyxHQUFHLFlBQVksQ0FBQztRQUdyQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFJWCxJQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNuQjtZQUNDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVDLElBQUcsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7YUFBRTtpQkFDM0IsSUFBRyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQUU7U0FDbkQ7UUFJRCxZQUFZLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRWhDLENBQUMsQ0FBQyxFQUFFLENBQUMifQ==