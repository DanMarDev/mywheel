const FONT_OPTIONS = [
  'Inter, system-ui, sans-serif',
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Impact, sans-serif',
  'Comic Sans MS, cursive',
];

const SETTINGS_GROUPS = [
  {
    title: 'Colors',
    fields: [
      { key: 'itemBackgroundColors', label: 'Slice colors', type: 'colorList', hint: 'Repeats around the wheel' },
      { key: 'itemLabelColors', label: 'Label colors', type: 'colorList', hint: 'Repeats around the wheel' },
      { key: 'lineColor', label: 'Divider line color', type: 'color' },
      { key: 'borderColor', label: 'Border color', type: 'color' },
      { key: 'itemLabelStrokeColor', label: 'Label outline color', type: 'color' },
    ],
  },
  {
    title: 'Lines & Size',
    fields: [
      { key: 'lineWidth', label: 'Divider line width', type: 'range', min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'borderWidth', label: 'Border width', type: 'range', min: 0, max: 30, step: 1, unit: 'px' },
      { key: 'radius', label: 'Wheel size', type: 'range', min: 0.1, max: 1, step: 0.01, percent: true },
      { key: 'offsetX', label: 'Horizontal offset', type: 'range', min: -0.5, max: 0.5, step: 0.01, percent: true },
      { key: 'offsetY', label: 'Vertical offset', type: 'range', min: -0.5, max: 0.5, step: 0.01, percent: true },
    ],
  },
  {
    title: 'Labels',
    fields: [
      { key: 'itemLabelFont', label: 'Font', type: 'select', options: FONT_OPTIONS.map((f) => ({ value: f, label: f.split(',')[0] })) },
      { key: 'itemLabelAlign', label: 'Alignment', type: 'select', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }] },
      { key: 'itemLabelFontSizeMax', label: 'Max font size', type: 'range', min: 4, max: 150, step: 1, unit: 'px' },
      { key: 'itemLabelRadius', label: 'Label start', type: 'range', min: 0, max: 1, step: 0.01, percent: true, hint: 'Distance from center where labels start' },
      { key: 'itemLabelRadiusMax', label: 'Label end', type: 'range', min: 0, max: 1, step: 0.01, percent: true, hint: 'Distance from center where labels must end' },
      { key: 'itemLabelRotation', label: 'Rotation', type: 'range', min: 0, max: 360, step: 1, unit: '°' },
      { key: 'itemLabelBaselineOffset', label: 'Baseline offset', type: 'range', min: -1, max: 1, step: 0.01, percent: true },
      { key: 'itemLabelStrokeWidth', label: 'Outline width', type: 'range', min: 0, max: 10, step: 0.5, unit: 'px' },
    ],
  },
  {
    title: 'Spinning',
    fields: [
      { key: 'spinSpeed', label: 'Spin button speed', type: 'range', min: 50, max: 2000, step: 10, unit: '°/s', hint: 'Capped by max speed' },
      { key: 'rotationSpeedMax', label: 'Max speed', type: 'range', min: 50, max: 2000, step: 10, unit: '°/s' },
      { key: 'rotationResistance', label: 'Resistance', type: 'range', min: -300, max: 0, step: 1, unit: '°/s²', hint: '0 spins forever' },
      { key: 'rotation', label: 'Starting rotation', type: 'range', min: 0, max: 360, step: 1, unit: '°' },
      { key: 'pointerAngle', label: 'Pointer angle', type: 'range', min: 0, max: 359, step: 1, unit: '°' },
      { key: 'isInteractive', label: 'Drag / flick to spin', type: 'checkbox' },
    ],
  },
  {
    title: 'Images',
    fields: [
      { key: 'image', label: 'Wheel image', type: 'image', hint: 'Fills the wheel behind the labels and rotates with it' },
      { key: 'imageOpacity', label: 'Wheel image opacity', type: 'range', min: 0, max: 1, step: 0.01, percent: true, hint: 'Lower to let slice colors show through' },
      { key: 'overlayImage', label: 'Overlay image', type: 'image', hint: 'Drawn on top, does not rotate' },
    ],
  },
  {
    title: 'Sounds',
    fields: [
      { key: 'spinSounds', label: 'Spin sounds', type: 'soundList', hint: 'Play while the wheel spins and stop when it stops' },
      { key: 'spinSoundMode', label: 'When spinning', type: 'select', options: [{ value: 'all', label: 'Play all sounds together' }, { value: 'random', label: 'Play one random sound' }] },
      { key: 'spinSoundVolume', label: 'Volume', type: 'range', min: 0, max: 1, step: 0.01, percent: true },
      { key: 'spinSoundLoop', label: 'Loop until the wheel stops', type: 'checkbox' },
      { key: 'stopSound', label: 'Stop sound', type: 'sound', hint: 'Plays once when the wheel lands or Stop is pressed' },
      { key: 'tickEnabled', label: 'Tick as items pass the pointer', type: 'checkbox' },
      { key: 'tickSound', label: 'Tick sound', type: 'sound', hint: 'Leave empty for the built-in click' },
      { key: 'tickVolume', label: 'Tick volume', type: 'range', min: 0, max: 1, step: 0.01, percent: true },
    ],
  },
  {
    title: 'Advanced',
    fields: [
      { key: 'pixelRatio', label: 'Pixel ratio', type: 'range', min: 0, max: 4, step: 0.25, hint: '0 uses your device pixel ratio' },
      { key: 'debug', label: 'Show debug info', type: 'checkbox' },
    ],
  },
];

function formatValue(field, value) {
  if (field.percent) return `${Math.round(value * 100)}%`;
  if (field.key === 'pixelRatio' && value === 0) return 'auto';
  return `${value}${field.unit ?? ''}`;
}

function ColorListField({ id, value, onChange }) {
  function setColor(index, color) {
    onChange(value.map((c, i) => (i === index ? color : c)));
  }

  return (
    <div className="color-list" id={id}>
      {value.map((color, index) => (
        <div key={index} className="color-chip">
          <input type="color" value={color} onChange={(e) => setColor(index, e.target.value)} aria-label={`Color ${index + 1}`} />
          <button className="chip-remove" onClick={() => onChange(value.filter((_, i) => i !== index))} disabled={value.length <= 1} aria-label={`Remove color ${index + 1}`}>×</button>
        </div>
      ))}
      <button className="chip-add" onClick={() => onChange([...value, value[value.length - 1]])} aria-label="Add color">+</button>
    </div>
  );
}

function ImageField({ id, value, onChange }) {
  function setImage(url) {
    if (value?.startsWith('blob:')) URL.revokeObjectURL(value);
    onChange(url);
  }

  return (
    <div className="image-field">
      {value && <img src={value} alt="" className="image-preview" />}
      <label className="btn btn-ghost btn-small file-button">
        {value ? 'Replace' : 'Upload'}
        <input id={id} type="file" accept="image/*" onChange={(e) => e.target.files[0] && setImage(URL.createObjectURL(e.target.files[0]))} />
      </label>
      {value && <button className="btn btn-ghost btn-small" onClick={() => setImage(null)}>Remove</button>}
    </div>
  );
}

function SoundListField({ id, value, onChange }) {
  function addSounds(files) {
    const added = Array.from(files).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    onChange([...value, ...added]);
  }

  function removeSound(index) {
    URL.revokeObjectURL(value[index].url);
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="sound-list">
      {value.map((sound, index) => (
        <div key={sound.url} className="sound-row">
          <span className="sound-name" title={sound.name}>{sound.name}</span>
          <button className="btn-icon" onClick={() => removeSound(index)} aria-label={`Remove ${sound.name}`}>×</button>
        </div>
      ))}
      <label className="btn btn-ghost btn-small file-button">
        + Add sound
        <input id={id} type="file" accept="audio/*" multiple onChange={(e) => { addSounds(e.target.files); e.target.value = ''; }} />
      </label>
    </div>
  );
}

function SoundField({ id, value, onChange }) {
  function setSound(file) {
    if (value) URL.revokeObjectURL(value.url);
    onChange(file ? { name: file.name, url: URL.createObjectURL(file) } : null);
  }

  return (
    <div className="sound-list">
      {value && (
        <div className="sound-row">
          <span className="sound-name" title={value.name}>{value.name}</span>
          <button className="btn-icon" onClick={() => setSound(null)} aria-label={`Remove ${value.name}`}>×</button>
        </div>
      )}
      <label className="btn btn-ghost btn-small file-button">
        {value ? 'Replace' : 'Upload'}
        <input id={id} type="file" accept="audio/*" onChange={(e) => { if (e.target.files[0]) setSound(e.target.files[0]); e.target.value = ''; }} />
      </label>
    </div>
  );
}

function SettingField({ field, value, onChange }) {
  const id = `setting-${field.key}`;

  let control;
  switch (field.type) {
    case 'color':
      control = <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'colorList':
      control = <ColorListField id={id} value={value} onChange={onChange} />;
      break;
    case 'range':
      control = (
        <div className="range-field">
          <input id={id} type="range" min={field.min} max={field.max} step={field.step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
          <output htmlFor={id}>{formatValue(field, value)}</output>
        </div>
      );
      break;
    case 'select':
      control = (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case 'checkbox':
      control = <input id={id} type="checkbox" className="toggle" checked={value} onChange={(e) => onChange(e.target.checked)} />;
      break;
    case 'image':
      control = <ImageField id={id} value={value} onChange={onChange} />;
      break;
    case 'sound':
      control = <SoundField id={id} value={value} onChange={onChange} />;
      break;
    case 'soundList':
      control = <SoundListField id={id} value={value} onChange={onChange} />;
      break;
  }

  return (
    <div className={`setting-field setting-${field.type}`}>
      <label htmlFor={id} className="setting-label">
        {field.label}
        {field.hint && <span className="setting-hint">{field.hint}</span>}
      </label>
      {control}
    </div>
  );
}

function WheelSettings({ settings, onChange, onReset }) {
  return (
    <details className="card settings-panel">
      <summary>
        <span>Wheel Settings</span>
        <span className="chevron" aria-hidden="true" />
      </summary>
      <div className="settings-groups">
        {SETTINGS_GROUPS.map((group) => (
          <fieldset key={group.title} className="settings-group">
            <legend>{group.title}</legend>
            {group.fields.map((field) => (
              <SettingField
                key={field.key}
                field={field}
                value={settings[field.key]}
                onChange={(value) => onChange(field.key, value)}
              />
            ))}
          </fieldset>
        ))}
      </div>
      <div className="settings-footer">
        <button className="btn btn-ghost" onClick={onReset}>Reset settings</button>
      </div>
    </details>
  );
}

export default WheelSettings
