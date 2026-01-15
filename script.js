const canvas = document.getElementById("drawingCanvas");
const clearButton = document.getElementById("clearCanvas");
const downloadButton = document.getElementById("downloadCanvas");
const colorButtons = document.querySelectorAll(".color-swatch");

if (canvas) {
  const context = canvas.getContext("2d");
  let drawing = false;

  let strokeColor = "#2d3f39";

  const resizeCanvas = () => {
    const { width } = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    context.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = width * scale;
    canvas.height = width * 0.6 * scale;
    context.scale(scale, scale);
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.strokeStyle = strokeColor;
  };

  const startDrawing = (event) => {
    drawing = true;
    context.beginPath();
    const { x, y } = getCanvasPosition(event);
    context.moveTo(x, y);
  };

  const stopDrawing = () => {
    drawing = false;
    context.closePath();
  };

  const draw = (event) => {
    if (!drawing) return;
    const { x, y } = getCanvasPosition(event);
    context.lineTo(x, y);
    context.strokeStyle = strokeColor;
    context.stroke();
  };

  const getCanvasPosition = (event) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const link = document.createElement("a");
    link.download = "aurora-ilustracion.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    startDrawing(event);
  });
  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    draw(event);
  });
  canvas.addEventListener("touchend", stopDrawing);

  if (clearButton) {
    clearButton.addEventListener("click", clearCanvas);
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", downloadCanvas);
  }

  if (colorButtons.length > 0) {
    colorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        strokeColor = button.dataset.color;
        colorButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  resizeCanvas();
}

const calendarGrid = document.getElementById("calendarGrid");
const calendarMonth = document.getElementById("calendarMonth");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

if (calendarGrid && calendarMonth) {
  let currentDate = new Date();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarMonth.textContent = currentDate.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    calendarGrid.innerHTML = "";

    ["L", "M", "X", "J", "V", "S", "D"].forEach((day) => {
      const header = document.createElement("div");
      header.className = "calendar-day header";
      header.textContent = day;
      calendarGrid.appendChild(header);
    });

    for (let i = 0; i < startDay; i += 1) {
      const empty = document.createElement("div");
      empty.className = "calendar-day empty";
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dayCell = document.createElement("div");
      dayCell.className = "calendar-day";
      const dayNumber = document.createElement("span");
      dayNumber.className = "calendar-day-number";
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);

      const today = new Date();
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      ) {
        dayCell.classList.add("today");
      }

      calendarGrid.appendChild(dayCell);
    }
  };

  prevMonthButton.addEventListener("click", () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextMonthButton.addEventListener("click", () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
}

