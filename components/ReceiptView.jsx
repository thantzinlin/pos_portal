import moment from "moment";
import money from "mm-money";

export default function ReceiptView({ order, subTotal, discount, tax, total }) {
  return (
    <div className="receipt-container print-only">
      <div className="receipt-header">
        <h1>RECEIPT</h1>
      </div>
      <div className="receipt-body">
        <div className="receipt-info">
          <p className="receipt-time">
            <strong>{moment().format("dddd, h:mm A")}</strong>
          </p>
          {/* <p>
            Customer Name <strong>Jack Stoe</strong>
          </p> */}
          <p>
            ID <strong>#{order.id}</strong>
          </p>
          <p>
            Table <strong>{order.table_number}</strong>
          </p>
        </div>
        <div className="receipt-items">
          {order.items.map((item) => (
            <p key={item.id}>
              {item.quantity}x {item.item_name}
              <span>{money.format(item.original_price)} Ks</span>
            </p>
          ))}
        </div>
        <div className="receipt-total">
          <p>
            Paid By <span>Cash</span>
          </p>
          <p>
            Sub Total <span>{subTotal} Ks</span>
          </p>
          <p>
            Discount <span>{discount} Ks</span>
          </p>
          <p>
            Tax <span>{tax} Ks</span>
          </p>
          <p>
            Total <span>{total} Ks</span>
          </p>
        </div>
      </div>
    </div>
  );
}
