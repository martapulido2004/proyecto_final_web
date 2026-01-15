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
const selectedDateLabel = document.getElementById("selectedDateLabel");
const selectedEventLabel = document.getElementById("selectedEventLabel");
const confirmAttendanceButton = document.getElementById("confirmAttendance");

if (calendarGrid && calendarMonth) {
  let currentDate = new Date();
  let selectedDate = null;
  let selectedEventId = null;
  let selectedEventTitle = "";
  let selectedEventDate = null;

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

  const sampleEvents = {
    "2026-01-15": [
      { id: "ceramica", title: "Taller de cerámica", time: "10:00", spots: 6 },
      { id: "escritura", title: "Escritura al amanecer", time: "07:30", spots: 4 },
    ],
    "2026-01-18": [
      { id: "fotografia", title: "Fotografía analógica", time: "16:00", spots: 5 },
    ],
    "2026-01-22": [
      { id: "sonido", title: "Laboratorio de sonido", time: "18:30", spots: 3 },
      { id: "lectura", title: "Círculo de lectura", time: "20:00", spots: 8 },
    ],
  };

  const updateSelectedEvent = (event, date) => {
    selectedEventId = event.id;
    selectedEventTitle = `${event.title} · ${event.time}`;
    selectedEventDate = date;
    selectedDateLabel.textContent = date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    selectedEventLabel.textContent = selectedEventTitle;
  };

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

      if (
        selectedDate &&
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate()
      ) {
        dayCell.classList.add("selected");
      }

      const today = new Date();
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      ) {
        dayCell.classList.add("today");
      }

      const key = formatDateKey(date);
      const items = sampleEvents[key] || [];
      if (items.length > 0) {
        items.forEach((item) => {
          const eventButton = document.createElement("button");
          eventButton.type = "button";
          eventButton.className = "calendar-event-button";
          eventButton.dataset.id = item.id;
          eventButton.dataset.date = key;
          eventButton.textContent = `${item.title} · ${item.time}`;
          eventButton.addEventListener("click", () => {
            selectedDate = date;
            updateSelectedEvent(item, date);
            renderCalendar();
            const matchingButton = document.querySelector(
              `.calendar-event-button[data-id="${item.id}"][data-date="${key}"]`,
            );
            if (matchingButton) {
              matchingButton.classList.add("selected");
            }
          });
          dayCell.appendChild(eventButton);
        });
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

  if (confirmAttendanceButton) {
    confirmAttendanceButton.addEventListener("click", () => {
      if (!selectedEventId || !selectedEventDate) {
        confirmAttendanceButton.textContent = "Selecciona una actividad";
        setTimeout(() => {
          confirmAttendanceButton.textContent = "Apuntarme a la actividad";
        }, 1500);
        return;
      }
      confirmAttendanceButton.textContent = "¡Reserva confirmada!";
      setTimeout(() => {
        confirmAttendanceButton.textContent = "Apuntarme a la actividad";
      }, 2000);
    });
  }

  selectedDateLabel.textContent = "Selecciona una actividad";
  selectedEventLabel.textContent = "Elige un botón dentro del calendario.";
  renderCalendar();
}
