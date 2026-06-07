import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PizzaCustomizer.css';

const SIZE_OPTIONS = [
  {
    id: 'small',
    name: 'Small',
    price: 199,
    description: 'Perfect for a solo pizza craving.',
    serves: 'Serves 1',
  },
  {
    id: 'medium',
    name: 'Medium',
    price: 349,
    description: 'Balanced choice for sharing and sides.',
    serves: 'Serves 2',
  },
  {
    id: 'large',
    name: 'Large',
    price: 499,
    description: 'Party-ready size for your pizza squad.',
    serves: 'Serves 3-4',
  },
];

const BASE_OPTIONS = [
  {
    id: 'hand-tossed',
    name: 'Hand Tossed',
    price: 0,
    description: 'Soft, airy crust with a classic Domino-inspired bite.',
    accent: '#f3b251',
    image: '🍕',
  },
  {
    id: 'thin-crust',
    name: 'Thin Crust',
    price: 50,
    description: 'Crispy edge-to-edge crust for a light, crunchy finish.',
    accent: '#f28f3b',
    image: '🥙',
  },
  {
    id: 'cheese-burst',
    name: 'Cheese Burst',
    price: 120,
    description: 'Loaded with molten cheese in every decadent slice.',
    accent: '#ff7b54',
    image: '🧀',
  },
  {
    id: 'wheat-thin-crust',
    name: 'Wheat Thin Crust',
    price: 80,
    description: 'A wholesome whole-wheat twist with a crisp finish.',
    accent: '#9e7b4f',
    image: '🌾',
  },
  {
    id: 'fresh-pan-pizza',
    name: 'Fresh Pan Pizza',
    price: 100,
    description: 'Golden, buttery pan base with a fluffy center.',
    accent: '#d96c06',
    image: '🥘',
  },
];

const SAUCE_OPTIONS = [
  {
    id: 'classic-tomato',
    name: 'Classic Tomato',
    description: 'Tangy tomato sauce with Italian herb warmth.',
    heat: 'Mild',
    image: '🍅',
  },
  {
    id: 'spicy-red-sauce',
    name: 'Spicy Red Sauce',
    description: 'Fiery tomato sauce for a spicy punch.',
    heat: 'Hot',
    image: '🌶️',
  },
  {
    id: 'bbq-sauce',
    name: 'BBQ Sauce',
    description: 'Smoky and sweet with a backyard grill vibe.',
    heat: 'Medium',
    image: '🔥',
  },
  {
    id: 'garlic-parmesan',
    name: 'Garlic Parmesan',
    description: 'Creamy garlic sauce with a cheesy finish.',
    heat: 'Mild',
    image: '🧄',
  },
  {
    id: 'peri-peri-sauce',
    name: 'Peri Peri Sauce',
    description: 'Zesty and bold with a citrus-chili kick.',
    heat: 'Hot',
    image: '🍋',
  },
];

const CHEESE_OPTIONS = [
  {
    id: 'mozzarella',
    name: 'Mozzarella',
    price: 0,
    description: 'Classic gooey mozzarella stretch.',
    image: '🧀',
  },
  {
    id: 'extra-mozzarella',
    name: 'Extra Mozzarella',
    price: 70,
    description: 'Extra cheesy pull in every bite.',
    image: '🫕',
  },
  {
    id: 'cheddar-blend',
    name: 'Cheddar Blend',
    price: 90,
    description: 'Sharp cheddar notes with creamy richness.',
    image: '🟨',
  },
  {
    id: 'parmesan-mix',
    name: 'Parmesan Mix',
    price: 120,
    description: 'Savory parmesan finish with Italian flair.',
    image: '🧂',
  },
  {
    id: 'triple-cheese',
    name: 'Triple Cheese',
    price: 150,
    description: 'Mozzarella, cheddar, and parmesan overload.',
    image: '💛',
  },
];

const VEGGIE_OPTIONS = [
  { id: 'onion', name: 'Onion', price: 20, color: '#d7bde2', icon: '🧅' },
  { id: 'capsicum', name: 'Capsicum', price: 20, color: '#7bd389', icon: '🫑' },
  { id: 'tomato', name: 'Tomato', price: 20, color: '#ff6b6b', icon: '🍅' },
  { id: 'sweet-corn', name: 'Sweet Corn', price: 30, color: '#ffd166', icon: '🌽' },
  { id: 'jalapeno', name: 'Jalapeno', price: 40, color: '#4caf50', icon: '🌶️' },
  { id: 'black-olive', name: 'Black Olive', price: 40, color: '#3b3b3b', icon: '🫒' },
  { id: 'mushroom', name: 'Mushroom', price: 50, color: '#c7b198', icon: '🍄' },
  { id: 'paneer', name: 'Paneer', price: 70, color: '#fff0c2', icon: '🟨' },
  { id: 'pineapple', name: 'Pineapple', price: 40, color: '#f7c948', icon: '🍍' },
  { id: 'broccoli', name: 'Broccoli', price: 60, color: '#2f9e44', icon: '🥦' },
];

const NON_VEG_OPTIONS = [
  { id: 'chicken-tikka', name: 'Chicken Tikka', price: 90, color: '#c96c42', icon: '🍗' },
  { id: 'chicken-sausage', name: 'Chicken Sausage', price: 80, color: '#9a4d30', icon: '🌭' },
  { id: 'grilled-chicken', name: 'Grilled Chicken', price: 100, color: '#b5653c', icon: '🍖' },
  { id: 'pepperoni', name: 'Pepperoni', price: 120, color: '#b33939', icon: '🥓' },
];

const FAVORITE_TEMPLATES = [
  {
    id: 'veg-fiesta',
    name: 'Veg Fiesta',
    description: 'Crowd favorite with vibrant veggies and classic cheese.',
    selection: {
      size: 'medium',
      base: 'hand-tossed',
      sauce: 'classic-tomato',
      cheese: 'mozzarella',
      veggies: ['onion', 'capsicum', 'sweet-corn', 'tomato'],
      nonVeg: [],
    },
  },
  {
    id: 'spicy-farmhouse',
    name: 'Spicy Farmhouse',
    description: 'Peri peri heat with paneer, jalapeno, and mushroom.',
    selection: {
      size: 'large',
      base: 'cheese-burst',
      sauce: 'peri-peri-sauce',
      cheese: 'triple-cheese',
      veggies: ['jalapeno', 'mushroom', 'paneer', 'onion'],
      nonVeg: [],
    },
  },
  {
    id: 'meat-feast',
    name: 'Meat Feast',
    description: 'Bold and loaded with spicy non-veg toppings.',
    selection: {
      size: 'large',
      base: 'fresh-pan-pizza',
      sauce: 'bbq-sauce',
      cheese: 'cheddar-blend',
      veggies: ['black-olive', 'onion'],
      nonVeg: ['chicken-tikka', 'pepperoni'],
    },
  },
];

const RECOMMENDED_COMBOS = [
  'Hand Tossed + Classic Tomato + Mozzarella for the familiar pizzeria classic.',
  'Cheese Burst + Peri Peri + Triple Cheese if you want a bold indulgent pizza night.',
  'Thin Crust + Garlic Parmesan + Mushroom + Black Olive for a crisp gourmet finish.',
];

const STEP_CONFIG = [
  { id: 1, title: 'Size', key: 'size' },
  { id: 2, title: 'Base', key: 'base' },
  { id: 3, title: 'Sauce', key: 'sauce' },
  { id: 4, title: 'Cheese', key: 'cheese' },
  { id: 5, title: 'Veggies', key: 'veggies' },
  { id: 6, title: 'Non-Veg', key: 'nonVeg' },
];

const PREVIEW_POSITIONS = [
  { top: '20%', left: '48%' },
  { top: '31%', left: '27%' },
  { top: '32%', left: '68%' },
  { top: '49%', left: '18%' },
  { top: '50%', left: '51%' },
  { top: '50%', left: '78%' },
  { top: '67%', left: '30%' },
  { top: '69%', left: '61%' },
  { top: '41%', left: '40%' },
  { top: '60%', left: '42%' },
  { top: '40%', left: '61%' },
  { top: '58%', left: '63%' },
];

const createLookup = (items) =>
  items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

const sizeLookup = createLookup(SIZE_OPTIONS);
const baseLookup = createLookup(BASE_OPTIONS);
const sauceLookup = createLookup(SAUCE_OPTIONS);
const cheeseLookup = createLookup(CHEESE_OPTIONS);
const veggieLookup = createLookup(VEGGIE_OPTIONS);
const nonVegLookup = createLookup(NON_VEG_OPTIONS);

const initialConfig = {
  size: '',
  base: '',
  sauce: '',
  cheese: '',
  veggies: [],
  nonVeg: [],
  quantity: 1,
  subtotal: 0,
  gst: 0,
  total: 0,
};

const PizzaCustomizer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [customization, setCustomization] = useState(initialConfig);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const pricing = useMemo(() => {
    const sizePrice = sizeLookup[customization.size]?.price || 0;
    const basePrice = baseLookup[customization.base]?.price || 0;
    const cheesePrice = cheeseLookup[customization.cheese]?.price || 0;
    const veggiePrice = customization.veggies.reduce(
      (sum, itemId) => sum + (veggieLookup[itemId]?.price || 0),
      0
    );
    const nonVegPrice = customization.nonVeg.reduce(
      (sum, itemId) => sum + (nonVegLookup[itemId]?.price || 0),
      0
    );

    const singlePizzaSubtotal = sizePrice + basePrice + cheesePrice + veggiePrice + nonVegPrice;
    const subtotal = singlePizzaSubtotal * customization.quantity;
    const gst = Number((subtotal * 0.18).toFixed(2));
    const total = Number((subtotal + gst).toFixed(2));

    return {
      sizePrice,
      basePrice,
      cheesePrice,
      veggiePrice,
      nonVegPrice,
      singlePizzaSubtotal,
      subtotal,
      gst,
      total,
    };
  }, [customization]);

  useEffect(() => {
    setCustomization((prev) => {
      if (
        prev.subtotal === pricing.subtotal &&
        prev.gst === pricing.gst &&
        prev.total === pricing.total
      ) {
        return prev;
      }

      return {
        ...prev,
        subtotal: pricing.subtotal,
        gst: pricing.gst,
        total: pricing.total,
      };
    });
  }, [pricing]);

  const selectedSize = sizeLookup[customization.size];
  const selectedBase = baseLookup[customization.base];
  const selectedSauce = sauceLookup[customization.sauce];
  const selectedCheese = cheeseLookup[customization.cheese];
  const selectedVeggies = customization.veggies.map((itemId) => veggieLookup[itemId]).filter(Boolean);
  const selectedNonVeg = customization.nonVeg.map((itemId) => nonVegLookup[itemId]).filter(Boolean);

  const previewToppings = [...selectedVeggies, ...selectedNonVeg];

  const isStepComplete = (stepId) => {
    switch (stepId) {
      case 1:
        return Boolean(customization.size);
      case 2:
        return Boolean(customization.base);
      case 3:
        return Boolean(customization.sauce);
      case 4:
        return Boolean(customization.cheese);
      case 5:
      case 6:
        return true;
      default:
        return false;
    }
  };

  const canContinue = isStepComplete(currentStep);
  const builderReady =
    customization.size && customization.base && customization.sauce && customization.cheese;

  const showToast = (message) => {
    setToast(message);
  };

  const handleSingleSelect = (key, value) => {
    setCustomization((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMultiToggle = (key, value) => {
    setCustomization((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  const goToNextStep = () => {
    if (!canContinue) {
      showToast('Please finish this step before continuing.');
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEP_CONFIG.length));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const applyTemplate = (template) => {
    setCustomization((prev) => ({
      ...prev,
      ...template.selection,
      quantity: prev.quantity,
    }));
    setCurrentStep(6);
    showToast(`${template.name} loaded into your builder.`);
  };

  const resetCustomization = () => {
    setCustomization(initialConfig);
    setCurrentStep(1);
    localStorage.removeItem('customPizza');
    showToast('Customization reset. Build a fresh pizza.');
  };

  const saveCustomPizza = () => {
    if (!builderReady) {
      showToast('Select size, base, sauce, and cheese before saving.');
      return;
    }

    const savedPayload = {
      customization: {
        ...customization,
        subtotal: pricing.subtotal,
        gst: pricing.gst,
        total: pricing.total,
      },
      savedAt: new Date().toISOString(),
      title: `${selectedSize.name} ${selectedBase.name}`,
    };

    localStorage.setItem('savedCustomPizza', JSON.stringify(savedPayload));
    showToast('Custom pizza saved for later.');
  };

  const handleAddToCart = () => {
    if (!builderReady) {
      showToast('Complete the builder before adding your pizza to cart.');
      return;
    }

    const pizza = {
      baseId: null,
      sauceId: null,
      cheeseId: null,
      vegetables: [],
      quantity: customization.quantity,
      price: pricing.total,
      subtotal: pricing.subtotal,
      gst: pricing.gst,
      total: pricing.total,
      customizations: {
        size: selectedSize,
        base: selectedBase,
        sauce: selectedSauce,
        cheese: selectedCheese,
        veggies: selectedVeggies,
        nonVeg: selectedNonVeg,
        quantity: customization.quantity,
        estimatedDeliveryTime: '25-30 mins',
      },
    };

    localStorage.setItem('customPizza', JSON.stringify(pizza));
    showToast('Pizza added to cart. Redirecting to checkout...');
    setTimeout(() => navigate('/checkout'), 500);
  };

  const renderSelectableCards = (items, selectedId, onSelect, type = 'single') => (
    <div className="selection-grid">
      {items.map((item) => {
        const selected = type === 'multi' ? selectedId.includes(item.id) : selectedId === item.id;
        const priceLabel = item.price ? `+₹${item.price}` : '+₹0';

        return (
          <button
            key={item.id}
            type="button"
            className={`selection-card ${selected ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <div className="selection-card-top">
              <span className="selection-icon">{item.image || item.icon || '🍕'}</span>
              <span className="selection-price">{priceLabel}</span>
            </div>
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            {item.serves && <span className="selection-meta">{item.serves}</span>}
            {item.heat && <span className="selection-meta">{item.heat} heat</span>}
          </button>
        );
      })}
    </div>
  );

  return (
    <section className="pizza-customizer">
      <div className="builder-shell">
        <div className="builder-header">
          <div>
            <span className="eyebrow">Premium Pizza Studio</span>
            <h2>Build your pizza like a pro</h2>
            <p>
              Pick your crust, sauce, cheese, and toppings with live pricing and a real-time
              preview.
            </p>
          </div>
          <div className="delivery-pill">
            <span>Estimated delivery</span>
            <strong>25-30 mins</strong>
          </div>
        </div>

        <div className="template-strip">
          {FAVORITE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className="template-card"
              onClick={() => applyTemplate(template)}
            >
              <strong>{template.name}</strong>
              <span>{template.description}</span>
            </button>
          ))}
        </div>

        <div className="builder-layout">
          <div className="builder-main">
            <div className="progress-card">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentStep / STEP_CONFIG.length) * 100}%` }}
                />
              </div>
              <div className="progress-steps">
                {STEP_CONFIG.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    className={`progress-step ${currentStep === step.id ? 'active' : ''} ${
                      isStepComplete(step.id) ? 'complete' : ''
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <span>{step.id}</span>
                    <small>{step.title}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="step-card">
              {currentStep === 1 && (
                <>
                  <div className="section-heading">
                    <div>
                      <span>Step 1</span>
                      <h3>Choose your pizza size</h3>
                    </div>
                    <p>Your size sets the starting price for the build.</p>
                  </div>
                  {renderSelectableCards(SIZE_OPTIONS, customization.size, (id) =>
                    handleSingleSelect('size', id)
                  )}
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="section-heading">
                    <div>
                      <span>Step 2</span>
                      <h3>Choose your crust base</h3>
                    </div>
                    <p>Only one crust at a time. The selected card unlocks Continue.</p>
                  </div>
                  {renderSelectableCards(BASE_OPTIONS, customization.base, (id) =>
                    handleSingleSelect('base', id)
                  )}
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="section-heading">
                    <div>
                      <span>Step 3</span>
                      <h3>Select your sauce</h3>
                    </div>
                    <p>Choose the flavor foundation for your whole pizza.</p>
                  </div>
                  {renderSelectableCards(SAUCE_OPTIONS, customization.sauce, (id) =>
                    handleSingleSelect('sauce', id)
                  )}
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div className="section-heading">
                    <div>
                      <span>Step 4</span>
                      <h3>Pick your cheese</h3>
                    </div>
                    <p>Cheese selection updates price and the pizza preview instantly.</p>
                  </div>
                  {renderSelectableCards(CHEESE_OPTIONS, customization.cheese, (id) =>
                    handleSingleSelect('cheese', id)
                  )}
                </>
              )}

              {currentStep === 5 && (
                <>
                  <div className="section-heading">
                    <div>
                      <span>Step 5</span>
                      <h3>Add veggie toppings</h3>
                    </div>
                    <p>Mix and match as many veggie toppings as you like.</p>
                  </div>
                  {renderSelectableCards(VEGGIE_OPTIONS, customization.veggies, (id) =>
                    handleMultiToggle('veggies', id),
                  'multi')}
                </>
              )}

              {currentStep === 6 && (
                <>
                  <div className="section-heading">
                    <div>
                      <span>Step 6</span>
                      <h3>Add non-veg toppings</h3>
                    </div>
                    <p>Optional extras for a fuller feast.</p>
                  </div>
                  {renderSelectableCards(NON_VEG_OPTIONS, customization.nonVeg, (id) =>
                    handleMultiToggle('nonVeg', id),
                  'multi')}
                </>
              )}

              <div className="step-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                >
                  Back
                </button>
                {currentStep < STEP_CONFIG.length ? (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={goToNextStep}
                    disabled={!canContinue}
                  >
                    Continue
                  </button>
                ) : (
                  <button type="button" className="primary-btn" onClick={handleAddToCart}>
                    Add To Cart
                  </button>
                )}
              </div>
            </div>

            <div className="recommendation-card">
              <div className="section-heading compact">
                <div>
                  <span>Chef Picks</span>
                  <h3>Recommended combinations</h3>
                </div>
              </div>
              <div className="recommendation-list">
                {RECOMMENDED_COMBOS.map((combo) => (
                  <div key={combo} className="recommendation-item">
                    {combo}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="summary-sidebar">
            <div className="pizza-preview-card">
              <div className={`pizza-stage ${customization.size || 'small'}`}>
                <div className={`pizza-base ${customization.base || 'hand-tossed'}`}>
                  <div className={`pizza-sauce ${customization.sauce || 'classic-tomato'}`} />
                  <div className={`pizza-cheese ${customization.cheese || 'mozzarella'}`} />
                  {previewToppings.map((topping, index) => {
                    const position = PREVIEW_POSITIONS[index % PREVIEW_POSITIONS.length];
                    return (
                      <span
                        key={`${topping.id}-${index}`}
                        className="pizza-topping"
                        style={{
                          top: position.top,
                          left: position.left,
                          backgroundColor: topping.color,
                        }}
                      >
                        {topping.icon}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="preview-caption">
                <strong>{selectedSize?.name || 'Choose a size'}</strong>
                <span>{selectedBase?.name || 'Select a crust to shape your pie'}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <div>
                  <span>Order Summary</span>
                  <h3>Your custom pizza</h3>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() =>
                      setCustomization((prev) => ({
                        ...prev,
                        quantity: Math.max(1, prev.quantity - 1),
                      }))
                    }
                  >
                    -
                  </button>
                  <strong>{customization.quantity}</strong>
                  <button
                    type="button"
                    onClick={() =>
                      setCustomization((prev) => ({
                        ...prev,
                        quantity: Math.min(10, prev.quantity + 1),
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Pizza Size</span>
                  <strong>{selectedSize ? `${selectedSize.name} (₹${selectedSize.price})` : 'Not selected'}</strong>
                </div>
                <div className="summary-line">
                  <span>Selected Base</span>
                  <strong>{selectedBase ? `${selectedBase.name} (+₹${selectedBase.price})` : 'Not selected'}</strong>
                </div>
                <div className="summary-line">
                  <span>Selected Sauce</span>
                  <strong>{selectedSauce ? selectedSauce.name : 'Not selected'}</strong>
                </div>
                <div className="summary-line">
                  <span>Selected Cheese</span>
                  <strong>{selectedCheese ? `${selectedCheese.name} (+₹${selectedCheese.price})` : 'Not selected'}</strong>
                </div>
                <div className="summary-line stacked">
                  <span>Selected Veggies</span>
                  <strong>{selectedVeggies.length ? selectedVeggies.map((item) => item.name).join(', ') : 'None'}</strong>
                </div>
                <div className="summary-line stacked">
                  <span>Selected Non-Veg</span>
                  <strong>{selectedNonVeg.length ? selectedNonVeg.map((item) => item.name).join(', ') : 'None'}</strong>
                </div>
              </div>

              <div className="pricing-breakdown">
                <div><span>Subtotal</span><strong>₹{pricing.subtotal.toFixed(2)}</strong></div>
                <div><span>GST (18%)</span><strong>₹{pricing.gst.toFixed(2)}</strong></div>
                <div className="grand-total"><span>Grand Total</span><strong>₹{pricing.total.toFixed(2)}</strong></div>
              </div>

              <div className="summary-actions">
                <button type="button" className="primary-btn" onClick={handleAddToCart}>
                  Add To Cart
                </button>
                <button type="button" className="secondary-btn" onClick={saveCustomPizza}>
                  Save Custom Pizza
                </button>
                <button type="button" className="ghost-btn" onClick={resetCustomization}>
                  Reset Customization
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {toast && <div className="toast-message">{toast}</div>}
    </section>
  );
};

export default PizzaCustomizer;
