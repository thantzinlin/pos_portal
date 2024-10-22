// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusb::{Context, DeviceHandle, UsbContext};
use std::time::Duration;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![print_receipt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn print_receipt(data: String) -> Result<(), String> {
    for device in rusb::devices().unwrap().iter() {
        let device_desc = device.device_descriptor().unwrap();

        println!(
            "Bus {:03} Device {:03} ID {:04x}:{:04x}",
            device.bus_number(),
            device.address(),
            device_desc.vendor_id(),
            device_desc.product_id()
        );
    }
    //     Bus 001 Device 003 ID 22d9:2766
    // Bus 001 Device 021 ID 04b8:0202
    // Bus 001 Device 022 ID 0c45:5004
    // Bus 001 Device 002 ID 05e3:0610
    // Bus 001 Device 000 ID 8086:a36d
    // Bus 001 Device 004 ID 045e:028e
    // Bus 001 Device 005 ID 30fa:1701
    // Replace these with your printer's Vendor ID and Product ID
    let vendor_id = 0x04b8;
    let product_id = 0x0202;

    let context = match Context::new() {
        Ok(ctx) => ctx,
        Err(e) => return Err(format!("Failed to create USB context: {}", e)),
    };

    let printer = match open_printer_device(&context, vendor_id, product_id) {
        Ok(device) => device,
        Err(e) => return Err(format!("Printer not found: {}", e)),
    };

    // Convert data to ESC/POS commands
    let commands = convert_to_esc_pos(data);

    // Send data to printer
    match send_to_printer(&printer, &commands) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to send data to printer: {}", e)),
    }
}

fn open_printer_device<T: UsbContext>(
    context: &T,
    vendor_id: u16,
    product_id: u16,
) -> Result<DeviceHandle<T>, rusb::Error> {
    for device in context.devices()?.iter() {
        let device_desc = device.device_descriptor()?;
        if device_desc.vendor_id() == vendor_id && device_desc.product_id() == product_id {
            let mut handle = device.open()?;
            handle.claim_interface(0)?;
            return Ok(handle);
        }
    }
    Err(rusb::Error::NoDevice)
}

fn convert_to_esc_pos(data: String) -> Vec<u8> {
    let mut commands = Vec::new();
    commands.extend_from_slice(&[0x1B, 0x40]); // Initialize printer
    commands.extend_from_slice(data.as_bytes()); // Data
    commands.push(0x0A); // New line
    commands.extend_from_slice(&[0x1D, 0x56, 0x00]); // Cut
    commands
}

fn send_to_printer<T: UsbContext>(
    printer: &DeviceHandle<T>,
    commands: &[u8],
) -> Result<(), rusb::Error> {
    printer.write_bulk(0x02, commands, Duration::from_secs(1))?; // 0x02 should be endpoint
    Ok(())
}
