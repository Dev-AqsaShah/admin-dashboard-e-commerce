
export const orderSchema = {
    name : "order",
    type : "document",
    title : "order",
    fields : [
        {
            name : "firstName",
            title : "First Name",
            type : "string",
        },
        {
            name : "lastName",
            title : "Last Name",
            type : "string"

        },
        {
            name : "address",
            title : "Address",
            type : "string",
        },
        {
            name : "city",
            title : "City",
            type : "string"

        },
        {
            name : "zipCode",
            title : "Zip Code",
            type : "string",
        },
        {
            name : "phone",
            title : "Phone",
            type : "string",
        },
        {
            name : "email",
            title : "Last Name",
            type : "string"

        },
        {
            name : "discount",
            type : "number",
            title : "Discount",
        },
        {
            name : "cartItems",
            title : "Cart Items",
            type : "array",
            of : [{ type : "reference", to : {type : "product"}}]
        },
        {
            name : "total",
            title : "Total",
            type : "number"
        },
        {
            name: "orderDate",
            title: "Order Date",
            type: "datetime",
        }
      
    ]
}