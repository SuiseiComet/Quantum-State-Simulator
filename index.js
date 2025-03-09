const canvas = document.querySelector('canvas')
const gui = new dat.GUI()
const c = canvas.getContext('2d')
canvas.width = innerWidth - 10
canvas.height = innerHeight - 10
const MILLISECONDS_IN_SECOND = 1000
const ANIMATION_SPEED_SCALE = 0.000000000001
g_previous_ticks = 0
frame_count = 0
points = 4500
hue = 0

const strokeColor = {
    r: 28,
    g: 90,
    b: 190,
    a: 1,
    rainbow: false
}

const background = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
    horizontal_lines: 5,
    tick_marks: 4
}

const simulation = {
    speed: 5,
    wave_amplitude: 150.0,
    well_width: canvas.width * 7/10,
    well_base_height: canvas.height * (8.5/10),
}

const backgroundFolder = gui.addFolder('Background and Grid')
backgroundFolder.add(background, 'r', 0, 255)
backgroundFolder.add(background, 'g', 0, 255)
backgroundFolder.add(background, 'b', 0, 255)
backgroundFolder.add(background, 'a', 0, 1)
backgroundFolder.add(background, 'horizontal_lines', 0, 10).step(1)
backgroundFolder.add(background, 'tick_marks', 0, 10).step(1)

const strokeFolder = gui.addFolder('Wave_color')
strokeFolder.add(strokeColor, 'r', 0, 255)
strokeFolder.add(strokeColor, 'g', 0, 255)
strokeFolder.add(strokeColor, 'b', 0, 255)
strokeFolder.add(strokeColor, 'a', 0, 1)
strokeFolder.add(strokeColor, 'rainbow', true, false)

const simulationFolder = gui.addFolder('Simulation Settings')
simulationFolder.add(simulation, 'speed', 1, 20)
simulationFolder.add(simulation, 'well_width', 1, canvas.width)
simulationFolder.add(simulation, 'well_base_height', 0, canvas.height)


function draw_grid_horizontal(){
    c.lineWidth = 1;

    for (let i = 0; i < background.horizontal_lines; i++) {
        
        c.beginPath()
        c.moveTo(left_boundary, simulation.well_base_height * i / background.horizontal_lines)
        c.lineTo(right_boundary, simulation.well_base_height * i / background.horizontal_lines)
    
        c.strokeStyle = `rgba(200, 200, 200, 0.5)`
        c.stroke();

    }

    c.lineWidth = 1.0;

}

function draw_tick_marks(){
    c.lineWidth = 2;

    for (let i = 1; i < background.tick_marks ; i++) {
        x = left_boundary + simulation.well_width * i / background.tick_marks  

        c.beginPath()
        c.moveTo(x, simulation.well_base_height - 8)
        c.lineTo(x, simulation.well_base_height + 8)
    
        c.strokeStyle = `rgba(200, 200, 200, 1)`
        c.stroke();

    }

    c.lineWidth = 1.0;

}

function draw_labels(){
    c.font = "30px Arial";
    c.fillStyle = 'white';
    c.textAlign = 'center'
    c.fillText("Position", canvas.width / 2, simulation.well_base_height + 40);
    c.fillText("0", left_boundary, simulation.well_base_height + 40);
    c.fillText("L", left_boundary + simulation.well_width, simulation.well_base_height + 40);

    c.save();
    c.translate(left_boundary - 25, simulation.well_base_height / 2);
    c.rotate(-Math.PI/2);
    c.fillText("Probability |ψ|\u00B2",0,0);

    c.restore();
}

function draw_box(){
    c.lineWidth = 4;

    c.beginPath()
    c.moveTo(left_boundary, 0)
    c.lineTo(left_boundary, simulation.well_base_height)
    c.lineTo(right_boundary, simulation.well_base_height)
    c.lineTo(right_boundary, 0)

    c.strokeStyle = `rgba(200, 200, 200)`
    c.stroke();
    c.lineWidth = 1.0;
}

function update() {

    ticks = Date.now() / MILLISECONDS_IN_SECOND;
    delta_time = ticks - g_previous_ticks;
    g_previous_ticks = ticks;

    frame_count += g_previous_ticks * ANIMATION_SPEED_SCALE * simulation.speed

    left_boundary = (canvas.width - simulation.well_width) / 2.0
    right_boundary = left_boundary + simulation.well_width

    c.fillStyle = `rgba(${background.r},${background.g},${background.b},${background.a})`
    c.fillRect(0, 0, canvas.width, canvas.height)
    draw_grid_horizontal()
    c.strokeStyle = `rgba(${strokeColor.r},${strokeColor.g},${strokeColor.b},${strokeColor.a})`

    for (let i = 0; i < points; i++) {

        x = i * simulation.well_width/points + left_boundary
        y = simulation.wave_amplitude * (Math.sin(i/points * Math.PI) ** 2
        + Math.sin(i/points * Math.PI * 2) ** 2
        + Math.sin(i/points* Math.PI)
           * Math.sin(i/points* Math.PI * 2)
           * Math.cos(2 * Math.PI * frame_count) * 2)

        c.beginPath()
        c.moveTo(x, simulation.well_base_height)
        c.lineTo(x, simulation.well_base_height - y)
        if (strokeColor.rainbow){
            hue = (y/simulation.wave_amplitude/3.5)*360 % 360
            c.strokeStyle = `hsl(${hue}, 100%, 50%)`
        }

        c.stroke();
    }
    draw_box()
    draw_labels()
    draw_tick_marks()
  }

function animate() {
  requestAnimationFrame(animate)
  update()
  
}

animate()
