import { Schema, model, models } from 'mongoose';

const PropertySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    location: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipcode: {
        type: String,
      },
    },
    beds: {
      type: Number,
    },
    baths: {
      type: Number,
    },
    square_feet: {
      type: Number,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rates: {
      nightly: {
        type: Number,
      },
      weekly: {
        type: Number,
      },
      monthly: {
        type: Number,
      },
    },
    seller_info: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
    covered_area: {
      type: Number,
    },
    garage: {
      type: Number,
    },
    services: [
      {
        type: String,
      },
    ],
    titles_status: {
      type: String,
    },
    interior: {
      aberturas: String,
      pisos: String,
      calefaccion: String,
    },
    exterior: {
      techos: String,
    },
    price: {
      type: String,
    },
    normalizedDescription: {
      resumen: { type: String },
      ubicacion: { type: String },
      detalles: [{ type: String }],
      highlights: [{ type: String }],
      nota: { type: String, default: null },
    },
    operation: {
      type: String,
      enum: ['compra', 'venta', 'alquiler'],
    },
    status: {
      type: String,
      enum: ['active', 'active_under_contract', 'closed', 'coming_soon', 'pending'],
      default: 'active',
    },
    property_type: {
      type: String,
      enum: ['residential', 'multi_family', 'land', 'commercial', 'rental', 'industrial'],
    },
  },
  {
    timestamps: true,
  }
);

const Property = models.Property || model('Property', PropertySchema);

export default Property;
